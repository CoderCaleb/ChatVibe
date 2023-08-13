ChatVibe ⭐️
=================

Discover a dynamic realm of real-time communication with our Chat Web App. Seamlessly join conversations, connect with others, and engage in interactive messaging like never before. This platform enables users to effortlessly join chats using unique chat codes, fostering a sense of community and ease of communication.

Check out the live version of ChatVibe: [ChatVibe Web App](https://chatvibe-app.netlify.app)

## Table of Contents

- [About](#screenshots)
- [Features](#features)
- [Getting Started](#getting-started)
- [Technologies Used](#technologies-used)
- [Communication](#communication)

## Screenshots 

![Screenshot of Vibe Chat Interface](https://imgur.com/J6IBIGQ.png)

![Screenshot of Vibe Chat Interface](https://imgur.com/y84Ejh4.png)

![Screenshot of Vibe Chat Interface](https://imgur.com/3fm6Y11.png)

![Screenshot of Vibe Chat Interface](https://imgur.com/2s5vjML.png)

![Screenshot of Vibe Chat Interface](https://imgur.com/BL9dnz4.png)

![Screenshot of Vibe Chat Interface](https://imgur.com/QSyk7gd.png)

## Features

- **Real-time Messaging:** Enjoy seamless communication with other users through real-time messaging.

- **Message Threading (Reply):** Engage in threaded conversations by replying to specific messages, enhancing the organization and context of discussions.

- **Group Admin Functionality:** Empower selected users with admin privileges, allowing them to remove members, promote others to admin status, and manage the group's activities effectively.

- **Unread Message Count:** Stay informed with the number of unread messages displayed, enabling users to catch up easily on new content.

- **Leave Chat:** Have the flexibility to exit a chat whenever desired, ensuring users are in control of their participation.

- **Direct Message (DM) Creation:** Create one-on-one DM chats effortlessly by using the other party's username, streamlining the process for initiating private conversations.

- **Group Chat Profile Customization** Personalize group chat profile pictures by choosing emojis that represent the chat's identity.

- **Edit About Me:** Modify your profile's "About Me" section, allowing users to share more about themselves and their interests.

- **Admin Privileges for Group Chats:** Group admins possess the authority to remove participants from the chat group, ensuring a safe and respectful environment.

- **Group Admin Management:** Admins can promote or demote participants to/from admin status, optimizing group dynamics and responsibilities.

- **Custom Profile Pictures**: Users have the ability to upload their own profile pictures. Whether it's an avatar, selfie, or anything in between, users can express themselves visually.

## Getting Started

To set up and run the ChatVibe project on your local machine, follow these steps:

- **Clone the Repository:**
```bash
git clone https://github.com/CoderCaleb/ChatVibe.git
```
- **Navigate to the Project Directory:**
```bash
cd ChatVibe
```

- **Install Dependencies:**
```bash
npm install
```

- **Configure Firebase:**
    - Create a Realtime Database and set up User Authentication (choose email and password) and Storage in your Firebase project.
    - Download the template JSON file provided in ./chatvibe_final.json and import it into your Firebase Realtime Database.
    - Copy the template for the Firebase Realtime Database rules in ./firebase_rules.json and paste it into your Firebase Realtime Database Rules.
    - Copy the template for the Firebase Storage rules in ./storage_rules.txt and paste it into your Firebase Storage Rules.

- **Add Firebase Config:**
    - Get the Firebase configuration object (SDK config) from your Firebase project.
    - Open src/App.js and paste the Firebase configuration object in the "// Paste your Firebase config SDK here" part.

- **Run the Application:**  
```bash
npm start
```

Feel free to reach out if you have any questions or encounter any issues during the setup process. We're here to help!

For bug reports, feature requests, or any other discussions related to the project, you can also use our GitHub Issues and Discussions boards.

Happy chatting! 🚀

## Technologies Used

- **React:** JavaScript library for building user interfaces.
- **Tailwind CSS:** Utility-first CSS framework for styling the user interface.
- **Firebase Realtime Database:** Backend service for real-time data synchronization and user authentication.
- **Firebase Authentication**: Secure user authentication and authorization for seamless access to app features.
- **Firebase Storage**: Cloud storage solution for efficiently storing and managing files, like user profile pictures.

## Contributing

Thank you for considering contributing to ChatVibe! We appreciate any contributions, whether they're large features, bug fixes, or improvements to code readability. Please keep in mind that the codebase might currently be a bit messy, but your contributions to enhance code quality are highly welcomed!

Before you proceed, here are a few things to keep in mind:

- The codebase might be a bit messy at the moment. We welcome your help in enhancing the code's organization and readability.
- All contributions will be thoroughly reviewed. This is to ensure that we maintain the quality and consistency of the project.
- Your contributions, no matter the size, are valuable to us. Every contribution helps us make ChatVibe better.

To get started:

1. **Fork this repository.**
2. **Create a new branch for your feature/fix:** `git checkout -b feature/your-feature-name`
3. **Make your changes and commit them:** `git commit -m 'Add some feature'`
4. **Push to your branch:** `git push origin feature/your-feature-name`
5. **Open a pull request against the `main` branch** of this repository.

We're excited to see your contributions and appreciate your help in making ChatVibe an even better platform for users to connect and communicate!


## Communication

Feel free to reach out if you have any questions, suggestions, or feedback regarding the **ChatVibe** project. We value your input and are eager to engage in meaningful conversations.

- **Issue Tracker:** If you come across any bugs, issues, or feature requests, please open an issue on our [GitHub repository](https://github.com/CoderCaleb/ChatVibe/issues). This allows us to track and address your concerns promptly.

- **Discussions:** Join the conversation on our [Discussions board](https://github.com/CoderCaleb/ChatVibe/discussions). Feel free to ask questions, share your thoughts, or engage with the community.

We believe that effective communication is essential for the growth and success of the project. We're excited to hear from you!

⚠️ **Note:** The codebase of this project is currently quite messy, as it was developed over a short period and only by one person. We appreciate your understanding and patience as we work towards improving its structure and readability. I would really appreciate help cleaning up the codebase.

Feel free to explore the features and start chatting with other users!

Any contributions, large or small, major features, bug fixes, are welcomed and appreciated

## About the Author

Hello there! I'm the developer behind ChatVibe. This project represents my first dive into the world of web development. Despite being fairly new to React, GitHub, and all things coding, I've poured my heart into ChatVibe over the course of about 1.5 months.

As a solo developer, I've navigated through challenges and learning curves. While I'm not an expert, I'm excited to share this platform that I've put together. ChatVibe aims to provide a seamless messaging experience and foster connections.

Your feedback and contributions are incredibly valuable to me. Let's make ChatVibe better together. Feel free to join in, suggest improvements, or just say hi!

Thanks for being a part of this journey with me.