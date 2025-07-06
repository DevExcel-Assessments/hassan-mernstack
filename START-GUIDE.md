# 🚀 Quick Start Guide - Hassan-mernstack assessment Project



## What You'll Need

Before we start, make sure you have:
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** running locally or a MongoDB Atlas account
- **FFmpeg** installed (for video compression)

## Let's Get Started! 🎯

### Step 1: Clone & Navigate
```bash
git clone <https://github.com/DevExcel-Assessments/hassan-mernstack>
cd hassan-mernstack
```

### Step 2: Set Up Environment Variables

#### For the Server (Backend)
Create a file called `.env` in the `server` folder:

```env
PORT=4000
(Same as to .env.example )
And also can use the local mongodb
```

#### For the Client (Frontend)
Create a file called `.env` in the `client` folder:

```env
VITE_API_URL=http://localhost:4000/api
VITE_CLIENT_URL=http://localhost:5173
```

### Step 3: Install Dependencies

Open two terminal windows and run:

**Terminal 1 (Server):**
```bash
cd server
npm install
```

**Terminal 2 (Client):**
```bash
cd client
npm install
```

### Step 4: Start the Application

**Terminal 1 (Server):**
```bash
cd server
npm start
```
✅ Server will be running at `http://localhost:4000`

**Terminal 2 (Client):**
```bash
cd client
npm run dev
```
✅ Client will be running at `http://localhost:5173`

## 🎉 You're All Set!

Open your browser and go to `http://localhost:5173` to see your course platform in action!

## 🔧 Need Help?

### Common Issues & Quick Fixes

**"Server won't start"**
- Make sure MongoDB is running
- Check if port 4000 is free
- Verify your `.env` file is in the right place

**"Client won't start"**
- Make sure you're in the `client` folder
- Try `npm cache clean --force`
- Delete `node_modules` and run `npm install` again




### Quick Commands Reference

```bash
# Start server
cd server && npm start

# Start client
cd client && npm run dev

# Install dependencies
npm install

# Clear cache
npm cache clean --force
```

## 📱 What You Can Do Now

- **Register/Login** as a user
- **Create courses** as a mentor
- **Upload videos** and thumbnails
- **Enroll in courses** as a learner
- **Watch videos** with streaming
- **Leave reviews** and ratings
- **Process payments** with Stripe
- **View analytics** on the dashboard

## 🆘 Still Stuck?

1. Check the console for error messages
2. Make sure all environment variables are set
3. Verify MongoDB is connected
4. Try restarting both servers

---

**Happy coding! 🚀**

Need more help? Check the main README.md for detailed documentation.
