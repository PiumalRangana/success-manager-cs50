import { genarateInsights } from "./insightsGenarator.js"
import { renderInsights } from "./insightRenderer.js"
import { makeInsightSessionsObject } from "./insightPipeline.js"
import {
    subscribeToAnalyticsSessionsChanges,
    subscribeToDateChanges
} from "../analyticsStore.js"

let activeInsightController = null
let insightRequestVersion = 0
let cleanupInsights = null

function cancelActiveInsightRequest() {
    insightRequestVersion += 1

    if (activeInsightController) {
        activeInsightController.abort()
        activeInsightController = null
    }
}

async function refreshInsights() {
    cancelActiveInsightRequest()

    const controller = new AbortController()
    const requestVersion = insightRequestVersion
    activeInsightController = controller

    try {
        const periodsAndSessionsObject = await makeInsightSessionsObject({
            signal: controller.signal
        })

        if (controller.signal.aborted || requestVersion !== insightRequestVersion) {
            return
        }

        const insights = genarateInsights(periodsAndSessionsObject)
        renderInsights(insights)
    } catch (error) {
        if (error.name !== "AbortError") {
            console.error("Error refreshing insights:", error)
        }
    } finally {
        if (activeInsightController === controller) {
            activeInsightController = null
        }
    }
}

export async function initializeInsights({ renderCurrent = true } = {}) {
    if (cleanupInsights) {
        cleanupInsights()
    }

    const unsubscribeFromSessions = subscribeToAnalyticsSessionsChanges(() => {
        void refreshInsights()
    })

    // A date change happens before its selected sessions are loaded. Cancel the
    // old comparison request now, then let the sessions listener start the new one.
    const unsubscribeFromDates = subscribeToDateChanges(() => {
        cancelActiveInsightRequest()
    })

    const cleanup = () => {
        unsubscribeFromSessions()
        unsubscribeFromDates()
        cancelActiveInsightRequest()

        if (cleanupInsights === cleanup) {
            cleanupInsights = null
        }
    }

    cleanupInsights = cleanup

    if (renderCurrent) {
        await refreshInsights()
    }

    return cleanup
}
