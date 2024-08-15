# Smart Ed Platform

Smart Ed is a comprehensive educational platform designed for both students and instructors. Built using the MERN stack, this application offers functionalities for course management, payment processing, and user authentication.

## Live Demo

You can explore the live demo of the Smart Ed platform at [Smart Ed Frontend](https://smart-ed-frontend.vercel.app/).

## Features

- **Payment Integration**: Seamless payment processing using Razorpay.
- **Course Management**:
  - **Instructors**: Create and manage courses.
  - **Students**: Browse, purchase courses, and watch video content.
- **Authentication**:
  - **Google OAuth**: Sign in using Google for students.
- **Instructor Dashboard**: View course analytics and performance using Chart.js.
- **Review System**: Students can leave reviews on courses.
- **Styling**: Modern and responsive design using Tailwind CSS.
- **Cloud Storage**:
  - **MongoDB Atlas**: Cloud-based database for course and user data.
  - **Cloudinary**: Media storage for course videos and images.

## Technologies

- **Frontend**:
  - React
  - Tailwind CSS
  - Various React libraries
- **Backend**:
  - Node.js
  - Express
  - MongoDB
  - Cloudinary
- **Testing**:
  - Postman for backend API testing

1. **Clone the repository**:
   
   ```bash
   git clone https://github.com/iamprinceraj/SmartEd-.git
   ```
   
2. **Navigate to the project directory:**:

   ```bash
   cd smart-ed

3. **Install frontend dependencies:**:

   ```bash
   cd client
   npm install
   
4. **Install Backend dependencies:**:

   ```bash
   cd ../server
   npm install
   
## Configure Environment Variables

Create a `.env` file in the `server` directory and add your MongoDB, Cloudinary, and Razorpay credentials. For example:

```env
MONGODB_URI=<your-mongodb-uri>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_SECRET=<your-razorpay-secret>
```
   
## Run the Project

### Start both Frontend and Backend from root directory

```bash
cd ../
npm start
```

## Deployment

- **Frontend**: Deployed on Vercel: [Smart-ED](https://smart-ed-frontend.vercel.app/)
- **Backend**: Deployed on [Render](https://smarted-backend.onrender.com)

## Usage

### Students

- Sign in using Google OAuth.
- Browse available courses, make payments, and watch video content.
- Leave reviews on courses.

### Instructors

- Create new courses and manage existing ones.
- View analytics and performance metrics on the instructor dashboard.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests for improvements or bug fixes. Please ensure to follow the project's coding standards and include relevant tests for new features.


## Contact

For any questions, issues, or support, please contact [dev.prince116@gmail.com](dev.prince116@gmail.com).



   
