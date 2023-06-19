import passport from "passport";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";
import config from "./config.js";
import UsersRepository from "../repository/users.repository.js";
import { usersManager } from "../dao/index.js";

const userRepository = new UsersRepository(usersManager);

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.private_key,
      },
      async (jwt_payload, done) => {
        try {
          if (!jwt_payload.user)
            return done(null, false, { messages: "Invalid credentials!" });

          return done(null, jwt_payload.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.client_id,
        clientSecret: config.client_secret,
        callbackURL: config.callback_url,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userRepository.findByEmail(profile._json.email);
          if (!user) {
            const result = await userRepository.createGitHubUser(profile._json);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userRepository.findById(id);

    done(null, user);
  });
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }
  return token;
};

export default initializePassport;
