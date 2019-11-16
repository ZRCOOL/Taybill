const signupRoutes = require('../routes/user/signup.user')
const loginRoutes = require('../routes/user/login.user')
const profileRoutes = require('../routes/user/profile.user')
const restRoutes = require('../routes/rest/signup.rest')
const restLoginRoute = require('../routes/rest/login.rest')
const restProfileRoutes = require('../routes/rest/profile.rest')

module.exports = (app) => {
    app.use("/api", signupRoutes)
    app.use("/api",loginRoutes)
    app.use("/api",profileRoutes)
    app.use("/api",restRoutes)
    app.use("/api",restLoginRoute)
    app.use("/api",restProfileRoutes)
}