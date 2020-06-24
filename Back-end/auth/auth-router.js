const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // ----> npm i jsonwebtoken

const Users = require("../users/users-model.js");
const secrets = require("../api/secrets.js");


router.post('/register', (req, res) => {
    const { username, password, email, role } = req.body;
    if (role === 'helper' || role === 'student') {
        if (username && password && email && role) {
            let user = req.body;
            const hash = bcrypt.hashSync(user.password, 10);
            user.password = hash;
            return Users.add(user)
                .then(saved => {
                    res.status(201).json({
                        id: saved.id,
                        username: saved.username,
                        password: saved.password,
                        useremail: saved.email,
                        role: saved.role,

                    })
                })
        } else res.status(400).json({ message: "Missing user parameters" });

    } else res.status(400).json({ message: "Invalid role being sent" });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;
    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user);
                res.status(200).json({
                    message: `Welcome ${user.username}!`,
                    id: user.id,
                    username: user.username,
                    password: user.password,
                    role: user.role,
                    token,
                });
            } else {
                res.status(401).json({ message: 'Invalid user credentials' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


function generateToken(user) {
    // the data
    const payload = {
        userId: user.id,
        username: user.username,
        role: user.role
    };
    const secret = secrets.jwtSecret;
    const options = {
        expiresIn: "1d",
    };

    return jwt.sign(payload, secret, options);
}

module.exports = router;