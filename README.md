# Success Manager

#### Video Demo: <URL HERE>

#### Description:
Success Manager is a Flask-based personal productivity tracker that helps users manage tasks, record focus sessions with a timer, explore their productivity through analytics, compare time periods, and optionally generate an AI focus report.

### Project Overview
Success Manager began with a simple question: when I spend time programming, am I
actually working consistently, or am I spending more time on other activities? I
wanted useful data to answer that question, but manually writing down every task
felt tiring and not valuable enough to maintain every day.

Success Manager makes that tracking easier. Users create tasks with a name and
colour, start a timer when they begin working on a task, and stop it when they
finish. The application records these focus sessions and turns them into charts,
visualisations, and period comparisons. This helps users understand where their
time went, recognise patterns in their work, and see how their productivity has
changed. Users can also optionally request an AI-generated report based on their
analytics data.

### How It Works

A user creates an account and logs in to their personal workspace. They can add
tasks with a name and a chosen colour. When they begin working on a task, they
start its timer and stop it when they finish.

Each completed timer becomes a focus session linked to that task. The application
stores the session's start time and end time, then uses the saved sessions to
create charts, visualisations, and comparisons between date ranges. This helps
the user see how they spend their time and how their activity changes over time.

Users can also optionally request an AI focus report. The application sends a
compact summary of the selected analytics data to the configured AI provider,
which returns a short, data-based report.

### Key Features

- User registration and login for personal task and session data.
- Task creation, editing, completion, restoration, and deletion.
- A focus timer that records start and end times for each task session.
- A daily time ring that shows how time has been spent during the current day.
- Analytics charts for focus time, task breakdowns, hourly patterns, and session lengths.
- Date-range comparisons that show changes between productivity periods.
- Optional AI-generated focus reports based on selected analytics data.
- User-friendly error messages for invalid input, unavailable analytics, and timer conflicts.

### Technologies Used

- Python and Flask for the server-side application and routes.
- SQLAlchemy as the object-relational mapper and SQLite for the database.
- Flask-Login for user authentication and session management.
- HTML, CSS, Bootstrap, JavaScript, and Jinja templates for the interface.
- D3.js and Chart.js for the daily timer ring and analytics charts.
- Flatpickr for date-range selection in analytics.
- The Gemini API, accessed through Google's GenAI Python SDK, for optional AI focus reports.

### Running Locally

1. Clone the repository and move into the project folder.

2. Create and activate a virtual environment. In PowerShell:

   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   python -m pip install -r requirements.txt
   ```

3. Create a `.env` file in the project root. This file is ignored by Git and
   must not be committed:

   ```text
   SECRET_KEY=replace-with-a-long-random-value
   DATABASE_URL=sqlite:///success_manager.db
   ```

   To enable optional AI focus reports, also add your Gemini API key:

   ```text
   GEMINI_API_KEY=your-key-here
   ```

4. Start the application:

   ```powershell
   python run.py
   ```

   Then open `http://127.0.0.1:5000` in a browser. Flask creates the SQLite
   database tables automatically when the application starts. Without a Gemini
   API key, the task, timer, and analytics features still work; only AI reports
   are unavailable.

### Important Design Decisions

- **Use local calendar time for productivity data.** A focus session late at
  night should belong to the same day the user sees on their calendar. Parsing
  date labels as local dates prevents UTC conversion from moving activity into
  the wrong day or hour.

- **Select overlapping sessions, then clip them to the requested range.** A
  session can cross midnight or extend beyond a selected date range. Clipping
  its start and end before calculating duration ensures charts count only the
  time that belongs in that range.

- **Soft-delete tasks that already have sessions.** Historic charts still need
  a deleted task's name and colour. Keeping the task record while hiding it
  from active task lists preserves that analytics context.

- **Compare incomplete periods with rates and averages.** Raw totals are not
  fair when the current period contains fewer days than the selected period.
  In that case, Success Manager compares per-day rates and averages instead.

- **Keep AI generation deliberate and bounded.** The browser sends a compact
  analytics summary only when the user requests a report. The server keeps the
  API key private, reuses identical saved reports, and applies cooldown and
  daily limits to reduce unnecessary requests and provider cost.

### Future Improvements

- **Privacy controls for task names.** Explore optional encryption for task
  names stored in the database, so users can keep sensitive work descriptions
  more private.

- **Task deletion choices.** Let users choose between archiving a task while
  preserving its historic sessions and analytics, or permanently deleting the
  task and its related session data after a clear confirmation.

- **Manual and editable focus sessions.** Allow users to add a session after
  forgetting to start a timer, or correct a session with an incorrect start or
  end time.

- **Task search and filtering.** Make it easier to find tasks as a user's task
  list grows.

- **Routines, timetables, and recurring schedules.** Support daily, weekly,
  and custom repeating tasks. Completion could apply to one scheduled
  occurrence instead of permanently completing the routine, giving daily and
  completed-task states a clearer purpose.

- **Task-specific analytics.** Let users filter analytics to one task, making
  it easier to understand that task's focus time, patterns, and changes over
  time.

- **Downloadable analytics data.** Let users export detailed focus-session and
  analytics data as CSV for spreadsheets or their own analysis, or as a PDF
  report for sharing and record-keeping. Users could then choose whether to
  ask another AI or analysis tool for additional support.

### Project Structure

The project separates server-side logic, page templates, and browser-side code.
The Flask application is contained in the `app` folder, while the root files
start the application, list its dependencies, and support local development.

```text
success-manager-cs50/
├── run.py                  Starts the Flask application.
├── seed.py                 Adds development or sample data.
├── requirements.txt        Lists Python dependencies.
├── README.md               Documents the project.
└── app/
    ├── __init__.py         Creates and configures the Flask application.
    ├── models.py           Defines the database models.
    ├── auth.py             Handles registration, login, and logout.
    ├── main.py             Handles task, timer, session, analytics, and AI routes.
    ├── ai_insight_provider.py
    │                       Validates, caches, limits, and generates AI reports.
    ├── helpers.py          Contains small colour-related helper functions.
    ├── templates/          Contains HTML pages, base layouts, and components.
    └── static/             Contains CSS, JavaScript, charts, and timer logic.
        ├── dailyTimeRing/  Builds the current-day time-ring visualisation.
        └── analytics/      Loads, calculates, and renders analytics features.
```
### Main File Responsibilities

#### Application and Database

- `run.py` is the application entry point. It creates the Flask application by
  calling the application factory and runs the development server.

- `app/__init__.py` contains the application factory. It configures Flask,
  initialises SQLAlchemy and Flask-Login, and registers the authentication and
  main route blueprints.

- `app/models.py` defines the database models: `User`, `Task`, `TimeSession`,
  and `AIInsightGeneration`. These models represent user accounts, tasks,
  recorded focus sessions, and saved AI reports.

- `app/auth.py` contains the registration, login, and logout routes. It
  validates form input, creates user accounts, checks passwords, and manages
  authenticated user sessions.

- `app/main.py` contains the main application routes. These routes display
  pages and handle task management, timer start and stop actions, session data,
  analytics API requests, and AI-insight API requests.

- `app/helpers.py` contains small reusable functions for working with task
  colours, including choosing readable text colours.

- `seed.py` is a development helper that can add sample users, tasks, and
  focus-session data to the database.

#### Templates and Page Layouts

The `templates` folder contains the HTML pages. It uses Jinja template
inheritance so that shared page structure, navigation, styling, and the footer
do not need to be repeated on every page.

- `base.html` is the shared outer layout. It defines the HTML document, common
  metadata, Bootstrap resources, global stylesheet, footer, and places where
  child templates can add page-specific content and scripts.

- `base_app.html` is the layout for authenticated pages. It adds navigation for
  tasks, completed tasks, analytics, and logout, and displays Flask messages to
  the user.

- `base_public.html` is the layout for login and registration pages.

- `base_landing.html` is the layout for the public landing page. It provides
  navigation for visitors who have not signed in.

- `components/brand.html` and `components/navBar.html` are reusable pieces for
  the application name and responsive navigation bar.

- `landing.html`, `login.html`, and `register.html` provide the public entry,
  login, and account-creation pages.

- `index.html` is the signed-in home page, which displays active tasks, timer
  controls, and the daily time ring. `add_tasks.html`, `edit_task.html`, and
  `completed_tasks.html` provide the task-management pages.

- `analytics.html` contains the analytics dashboard structure and placeholders
  for its charts, date controls, comparison information, and AI report.

- `about.html` provides the supporting product-information page.

#### Timer and Daily Time Ring

The home page JavaScript separates timer actions, session data, visual
calculations, and drawing the daily time ring.

- `time.js` sends start and stop requests to the Flask timer routes. It shows
  user-facing errors when a request fails and refreshes today’s session data
  after a successful change.

- `home.js` initialises the signed-in home page. It loads today’s sessions,
  starts the time ring and legend, and enables task-name overflow helpers.

- `dailyTimeRing/dailySessionStore.js` fetches today’s sessions from the API,
  stores them in browser memory, and notifies subscribed features when the data
  changes.

- `dailyTimeRing/chart/chartCore.js` starts the D3 ring feature and shows a
  compact message if the visualisation library is unavailable.

- `chartController.js` coordinates one-second updates. `chartDataPipeline.js`
  converts sessions into task and idle segments, angles, timer text, and focus
  status. `chartRenderer.js` uses D3 to draw and update the SVG ring.

- The `dailyTimeRing/legand` files build the matching task-and-idle-time legend:
  `index.js` coordinates updates, `legendPipeline.js` calculates the values,
  and `legendRenderer.js` displays them.

- `utils/domUtils.js` contains reusable helpers for truncated task and legend
  names, including tooltips and click-to-expand behaviour.

#### Analytics Dashboard: Shared Data Flow

The analytics dashboard is organised around a shared dashboard data model. This
allows each chart and visualisation to use the same selected date range and
derived session data.

- `analyticsController.js` is the main coordinator for the analytics page. It
  initialises date controls and visual features, loads the selected, previous,
  and present comparison periods, and manages loading, empty, retry, and
  unavailable-visualisation states. It cancels older requests when a user
  quickly changes the date range, preventing stale data from replacing newer
  results.

- `analyticsService.js` requests raw sessions from Flask for each required date
  range. It checks for network, authentication, response, and data-shape errors
  before returning data to the dashboard.

- `analyticsStore.js` keeps the active date range, selected sessions, and
  dashboard model in one shared browser-side store. Features subscribe to
  changes instead of fetching their own separate data.

- `analyticsCalculator.js` performs date-safe session calculations. It clips
  overlapping sessions to the selected range and splits long sessions across
  day and hour boundaries before calculating totals, task breakdowns, activity
  patterns, and session-length data.

- `dashboardPipeline.js` creates equal-length comparison periods and combines
  each period's calculated statistics into one dashboard model. When the most
  recent comparison period is shorter, it compares rates and averages rather
  than misleading raw totals.

- `calendar-selector/calendar-selector.js` and
  `date-range-selector/dateRangeSelector.js` provide the custom calendar and
  date-range controls. `small-info-cards/small-info-cards.js` displays summary
  values for the active range.

- `utils.js` provides a small helper for clipping session dates to the selected
  range when a feature needs that information.

#### Analytics Dashboard: Visualisations

Each analytics visualisation listens for changes to the shared dashboard model.
Its controller manages updates, its pipeline adapts dashboard data for display,
and its renderer creates the chart or interface. Feature-specific CSS files
style the non-Chart.js components.

- `total-focuse-bar-chart/` displays focus minutes for each day in the selected
  range as a bar chart.

- `time-per-task/` displays how selected focus time is divided between tasks as
  a colour-matched donut chart.

- `time-distribution-by-hour/` groups focus minutes into all 24 hours of the
  day, showing when the user usually works.

- `activity-consistency/` builds a calendar-style activity grid. It shows
  active and inactive days, focus information, and working or break streaks.

- `session-length-distribution/` groups completed sessions into length ranges,
  helping the user see whether their focus sessions are typically short,
  medium, or long.

- `period-comparison/` displays selected-period changes against the previous
  period and, when available, the current period. It switches to per-day and
  average metrics when the current period is incomplete, so comparisons remain
  fair.

#### AI Insight Feature

The AI Insight feature is optional. It converts the selected analytics dashboard
into a compact summary and, only when the user requests it, asks Gemini to
generate a short focus report.

- `ai-insight/insightController.js` coordinates the feature in the browser. It
  reacts to analytics date-range changes, checks whether a saved report exists,
  and handles requests to view, generate, or regenerate a report.

- `ai-insight/insightPayload.js` creates a smaller AI-specific payload from the
  dashboard model. It sends summaries, patterns, comparisons, and a limited
  task breakdown instead of raw session records. Long date ranges are
  summarised weekly, and task data is capped to keep requests readable.

- `ai-insight/insightService.js` sends requests to the Flask AI endpoints.
  `insightRenderer.js` displays empty, loading, saved, successful, and error
  states in the analytics page. `ai-insight.css` styles this interface.

- The AI routes in `main.py` require authentication and return appropriate
  error responses for invalid requests, generation limits, or unavailable
  provider service.

- `ai_insight_provider.py` is the server-only Gemini integration. It validates
  incoming payloads, keeps the API key on the server, builds a data-grounded
  prompt, validates Gemini’s response, and saves successful reports.

  It also hashes identical payloads to reuse cached reports, applies a
  cooldown and daily per-user generation limit, and prevents raw-total
  comparisons when one comparison period is shorter. These choices protect
  users from misleading reports and prevent unnecessary AI-provider cost.

#### Styling and Supporting Files

- `main.css` provides the shared visual style for the application, including
  layout, navigation, task cards, forms, responsive behaviour, and the dark
  theme.

- `analytics.css` provides page-level styling for the analytics dashboard.
  The feature-specific CSS files style the activity calendar, AI Insight panel,
  calendar selector, date-range selector, period comparison, and small summary
  cards.

- `script.js` provides general browser helpers for registration and login
  pages, including password visibility controls and matching-password feedback.
  It also keeps task timer buttons disabled when the page loads with a running
  timer.

- `completedTasks.js` applies the shared task-name overflow helpers to the
  completed-task list.

- `requirements.txt` lists the Python packages required to run the project,
  including Flask, Flask-Login, Flask-SQLAlchemy, and the Google GenAI SDK.
