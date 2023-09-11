const User = require('../Models/user');
module.exports.renderRegister = async(req, res) => {
    res.render('users/register');
}
module.exports.register = async(req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, function(err) {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp!!!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}
module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}
module.exports.logout = (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Successfully Logged Out");
        res.redirect('/campgrounds');
    });
}