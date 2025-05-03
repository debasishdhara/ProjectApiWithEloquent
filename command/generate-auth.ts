import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Get middleware name
const middlewareType = process.argv[2]?.toLowerCase();
const rootDir = path.resolve(__dirname, '../');
const middlewareDir = path.join(rootDir, 'app', 'middleware');
const envPath = path.join(rootDir, '.env');

if (!middlewareType || !['jwt', 'passport'].includes(middlewareType)) {
  console.error('❌ Please specify a valid middleware type: JWT or Passport');
  process.exit(1);
}

// Ensure middleware directory exists
if (!fs.existsSync(middlewareDir)) {
  fs.mkdirSync(middlewareDir, { recursive: true });
}

const writeEnvIfMissing = (key: string, value: string) => {
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  if (!envContent.includes(`${key}=`)) {
    fs.appendFileSync(envPath, `\n${key}=${value}`);
    console.log(`🔐 Added ${key} to .env`);
  }
};

const generateJWT = () => {
  // Install packages
  console.log('📦 Installing JWT packages...');
  execSync('npm install jsonwebtoken dotenv', { stdio: 'inherit' });
  execSync('npm install --save-dev @types/jsonwebtoken', { stdio: 'inherit' });

  // Add env keys
  writeEnvIfMissing('JWT_SECRET', 'your_jwt_secret_here');
  writeEnvIfMissing('REFRESH_TOKEN_SECRET', 'your_refresh_token_secret_here');

  // Generate middleware file
  const middlewarePath = path.join(middlewareDir, 'jwt.ts');
  if (!fs.existsSync(middlewarePath)) {
    fs.writeFileSync(middlewarePath, `import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};`);
    console.log(`✅ JWT middleware created at: ${middlewarePath}`);
  }
};

const generatePassport = () => {
  console.log('📦 Installing Passport packages...');
  execSync('npm install passport passport-jwt', { stdio: 'inherit' });
  execSync('npm install --save-dev @types/passport @types/passport-jwt', { stdio: 'inherit' });

  // Add env keys
  writeEnvIfMissing('JWT_SECRET', 'your_jwt_secret_here');
  writeEnvIfMissing('REFRESH_TOKEN_SECRET', 'your_refresh_token_secret_here');
  const middlewarePath = path.join(middlewareDir, 'passport.ts');
  if (!fs.existsSync(middlewarePath)) {
    fs.writeFileSync(middlewarePath, `import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: false, // optional: if using req in callback
};

passport.use(new JwtStrategy(opts, (jwt_payload: any, done: (error: any, user?: any, info?: any) => void) => {
  // Replace with real user lookup logic
  if (jwt_payload) {
    return done(null, jwt_payload);
  } else {
    return done(null, false);
  }
}));

export default passport;`);
    console.log(`✅ Passport middleware created at: ${middlewarePath}`);
  }
};

if (middlewareType === 'jwt') {
  generateJWT();
} else if (middlewareType === 'passport') {
  generatePassport();
}
