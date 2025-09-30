import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

//Utiles
import connectDB from './config/bd.js';

// Routes
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import tastimonialRoute from './routes/tastimonialRoutes.js';
import photoRoutes from './routes/photoRoutes.js';
import resumeRoute from './routes/resumeRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import jobRouter from './routes/jobRoutes.js';
import aplicacionRouter from './routes/jobAplicacion.js';
import teamRouter from './routes/teamRoutes.js';
import studyWorkRoutes from './routes/studyWorkRoutes.js';
import LanguageCourseRoutes from './routes/languageCourseRoutes.js';
import enrollRouter from './routes/languageEnrollRoutes.js';

dotenv.config();
const port = process.env.PORT || 7000;

connectDB();

const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use((req, res, next) => {
//   console.log('Incoming request:', req.path);
//   next();
// });

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/testimonial', tastimonialRoute);
app.use("/api/resume", resumeRoute)
app.use('/api/message', messageRoutes);
app.use("/api/job", jobRouter)
app.use('/api/jobAplicacion', aplicacionRouter);
app.use("/api/team", teamRouter);
app.use("/api/Study-Work", studyWorkRoutes);
app.use('/api/language', LanguageCourseRoutes);
app.use("/api/enroll", enrollRouter)



app.use('/api/upload', uploadRoutes);
app.use('/api/photo', photoRoutes);
app.use('/api/files', fileRoutes);

const __dirname = path.resolve();

app.use(
  '/uploads',
  express.static(path.join(__dirname + '/uploads'), {
    setHeaders: (res, path) => {
      res.set('Cache-Control', 'public, max-age=31536000'); // 1 year cache
    },
  })
);
app.use(
  '/photos',
  express.static(path.join(__dirname + '/photos'), {
    setHeaders: (res, path) => {
      res.set('Cache-Control', 'public, max-age=31536000'); // 1 year cache
    },
  })
);
app.use(
  '/files',
  express.static(path.join(__dirname, 'files'), {
    setHeaders: (res, path) => {
      res.set('Cache-Control', 'public, max-age=31536000'); // optional long-term cache
    },
  })
);


if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, 'frontend', 'dist');

  // Serve static files
  app.use(express.static(frontendPath));
  
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

  app.listen(port, () =>
    console.log(`Server running on port http://localhost:${port}`)
  );

