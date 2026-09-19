/**
 * @jest-environment jsdom
 */
import { MockFeatureSettingsRepository } from '#mocks/repositories/fetureSettings'
import { MockUsageStatisticsRepository } from '#mocks/repositories/usageStatistics'
import { CHANGE_CRITERIAS } from '#pages/hooks/useStatsStore'
import Links from '#pages/links'
import Popup from './Popup'
import { faker } from '@faker-js/faker'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import 'core-js/stable/structured-clone'
import React from 'react'
import { runtime, storage, tabs } from 'webextension-polyfill'

describe('unit test for Popup app component', () => {
  const mockFeatureSettingsRepo = new MockFeatureSettingsRepository()
  const mockUsageStatsRepo = new MockUsageStatisticsRepository()

  const storageChangeListeners: CallableFunction[] = []
  jest.spyOn(storage.onChanged, 'addListener').mockImplementation(listener => {
    storageChangeListeners.push(listener)
  })

  afterAll(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('can render properly', async () => {
    const { container, unmount } = render(
      <Popup
        featureSettingsRepo={mockFeatureSettingsRepo}
        usageStatisticsRepo={mockUsageStatsRepo}
      />
    )

    waitFor(() => expect(container).toMatchSnapshot())

    // Check navbar
    const user = userEvent.setup()
    await user.click(screen.getByTestId('navbar-options'))
    expect(runtime.openOptionsPage).toHaveBeenCalled()

    await user.click(screen.getByTestId('navbar-history'))
    expect(tabs.create).toHaveBeenCalled()

    // Check footbar action - version click
    const footerInfo = screen.getByTestId('footer-info')
    await act(async () => {
      await user.click(footerInfo)
    })
    expect(tabs.create).toHaveBeenLastCalledWith({
      active: true,
      url: Links.website,
    })

    const footerActionPortal = screen.getByTestId('footer-action-portal')
    await act(async () => {
      await user.hover(footerActionPortal)
      await user.click(footerActionPortal)
    })
    expect(tabs.create).toHaveBeenLastCalledWith({
      active: true,
      url: Links.portal,
    })
    expect(screen.getByTestId('footer-info')).toHaveTextContent(
      new RegExp('portal', 'i')
    )

    const footerActionGithub = screen.getByTestId('footer-action-github')
    await act(async () => {
      await user.hover(footerActionGithub)
      await user.click(footerActionGithub)
    })

    expect(tabs.create).toHaveBeenLastCalledWith({
      active: true,
      url: Links.github,
    })
    expect(screen.getByTestId('footer-info')).toHaveTextContent(
      new RegExp('github', 'i')
    )

    await act(async () => {
      storageChangeListeners.forEach(listener =>
        listener(faker.helpers.arrayElement([...CHANGE_CRITERIAS.keys()]), {
          newValue: 1,
          oldValue: 0,
        })
      )
    })

    unmount()

    expect(storage.onChanged.removeListener).toHaveBeenCalled()
  })
})
