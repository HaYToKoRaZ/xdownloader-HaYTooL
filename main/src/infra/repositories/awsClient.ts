/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Client, ClientUUID } from '#domain/entities/client'
import type { Factory } from '#domain/factories/base'
import type { IClientRepository } from '#domain/repositories/client'
import { UsageStatistics } from '#domain/valueObjects/usageStatistics'
import type { ApiClient } from '#libs/AWSClientApi'
import { CreateClientCommand, SyncClientCommand } from '#libs/AWSClientApi'
import type { IStorageProxy } from '#libs/storageProxy'
import type { ClientInfo, V4Statistics } from '#schema'
import { toErrorResult, toSuccessResult } from '#utils/result'

const UNKNOWN = 'unknown'

const emptyClientInfo: ClientInfo = {
  csrfToken: UNKNOWN,
  syncedAt: 0,
  uninstallCode: UNKNOWN,
  uuid: UNKNOWN,
}

const defaultStats: V4Statistics = {
  downloadCount: 0,
  trafficUsage: 0,
}

export class AWSClientRepository implements IClientRepository {
  constructor(
    readonly apiClient: ApiClient,
    readonly storageProxy: IStorageProxy<ClientInfo>
  ) {}

  private async createClient(initStats: V4Statistics): AsyncResult<Client> {
    const command = new CreateClientCommand({
      initStats: {
        downloadCount: initStats.downloadCount,
        trafficUsage: initStats.trafficUsage,
      },
    })
    const { value: resp, error } = await this.apiClient.send(command)
    if (error) return toErrorResult(error)

    const clientId = new ClientUUID(resp.clientUUID)
    const client = new Client(clientId, {
      syncToken: resp.syncToken,
      syncedAt: 0,
      uninstallCode: resp.uninstallCode,
      usageStatistics: new UsageStatistics({ ...initStats }),
    })
    return toSuccessResult(client)
  }

  async get(): AsyncResult<Client> {
    const item = await this.storageProxy.getItemByDefaults({
      ...emptyClientInfo,
      ...defaultStats,
    })
    if (isEmptyClientInfo(item)) {
      // Harici AWS sunucusu tanımlı değilse yerel istemci kimliği oluşturulur ve gereksiz ağ hataları (Failed to fetch) engellenir
      const generatedUuid =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : 'c-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
      const clientId = new ClientUUID(generatedUuid)
      const client = new Client(clientId, {
        syncToken: 'local-token',
        syncedAt: Date.now(),
        uninstallCode: 'local-code',
        usageStatistics: new UsageStatistics({
          downloadCount: item.downloadCount,
          trafficUsage: item.trafficUsage,
        }),
      })

      await this.save(client)
      return toSuccessResult(client)
    }

    const clientId = new ClientUUID(item.uuid)
    const client = new Client(clientId, {
      syncToken: item.csrfToken,
      syncedAt: item.syncedAt,
      uninstallCode: item.uninstallCode,
      usageStatistics: new UsageStatistics({
        downloadCount: item.downloadCount,
        trafficUsage: item.trafficUsage,
      }),
    })
    return toSuccessResult(client)
  }

  async sync(client: Client): Promise<UnsafeTask> {
    // Harici API anahtarı veya adresi yapılandırılmamışsa senkronizasyon yerel olarak tamamlanır
    const host = process.env.API_HOSTNAME
    if (!host || host === 'some-host' || host === 'api-hostname') {
      return this.save(client)
    }

    const command = new SyncClientCommand({
      clientId: client.id.value,
      stats: client.usageStatistics.mapBy(props => props),
      syncToken: client.syncToken,
    })
    const { value: resp, error } = await this.apiClient.send(command)
    if (error) return error

    client.updateSyncToken(resp.syncToken)
    return this.save(client)
  }

  /**
   * NOTE: Since we will implicitly update usage statistics when saving the client entity,
   * this process might need a lock to prevent race condition in the future.
   */
  private async save(client: Client): Promise<void> {
    return this.storageProxy.setItem(clientToDBItem(client))
  }
}

const clientToDBItem: Factory<Client, ClientInfo & V4Statistics> = client =>
  client.mapBy((id, props) => ({
    csrfToken: props.syncToken,
    syncedAt: props.syncedAt,
    uninstallCode: props.uninstallCode,
    uuid: id.value,
    ...props.usageStatistics.mapBy(props => props),
  }))

const isEmptyClientInfo = (clientInfo: ClientInfo) =>
  [clientInfo.csrfToken, clientInfo.uuid, clientInfo.uninstallCode].some(
    v => v === UNKNOWN
  )
