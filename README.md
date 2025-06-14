# Modern Calendar Application

A feature-rich calendar application built with React, TypeScript, and Tailwind CSS. This application helps users manage their schedule, track habits, set goals, and stay organized with a beautiful and intuitive interface.

**[Try the app online →](https://https://calendar-ppn5zfy9g-stuart-muyambis-projects.vercel.app/)** 

##  Features

-  Multiple calendar views (Year, Month, Week)
-  Goal tracking and progress monitoring
-  Habit tracking with streaks
-  Dark/Light theme support
-  Quick search functionality
-  Responsive design for all devices
-  Stats dashboard
-  Data import/export capabilities

##  Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **State Management**: React Context API

##  Keyboard Shortcuts

- `⌘K` - Open Search
- `⌘G` - Toggle Goals Panel
- `⌘H` - Toggle Habits Panel
- `⌘D` - Toggle Dark Mode

##  Installation

1. Clone the repository
```bash
git clone <repository-url>
cd calendar-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

##  Customization

### Theme Customization
The app supports both light and dark themes with customizable color schemes. Colors can be adjusted in the `src/index.css` file:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... other color variables */
}
```

### Adding Custom Categories
Users can add custom categories for notes and goals through the settings panel.

##  Data Management

- **Local Storage**: All data is stored locally in the browser
- **Data Export**: Export your data as JSON for backup
- **Data Import**: Import previously exported data
- **Data Reset**: Option to clear all data and start fresh

##  Privacy

All data is stored locally on your device. No data is sent to any external servers.

##  Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

##  License

This project is [MIT](LICENSE) licensed.

##  Acknowledgments

- Built with [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Calendar implementation using [react-day-picker](https://react-day-picker.js.org/)

