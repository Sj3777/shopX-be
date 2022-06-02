const express = require('express');
const ProductSchema = require("../model/Product")
const userSchema = require("../model/User")
const Cart = require("../model/Cart")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
exports.addProduct = async (req, res) => {
    console.log("req.body", req.body);
    const product = new ProductSchema({
        "p_name": req.body.p_name,
        "p_description": req.body.p_description,
        "p_price": req.body.p_price,
        "p_image": req.body.p_image,
        "p_qty": req.body.p_qty
    });
    try {
        const con_save = await product.save();
        res.send({
            "status": "Success",
            "Data": con_save
        });
        console.log(con_save);
    } catch (err) {
        console.log(err);
    }
}

exports.getProduct = async (req, res) => {
    try {
        const product = await ProductSchema.find();
        res.send({
            "status": "Success",
            "Data": product
        });
    } catch (err) {
        res.send("Error" + err);
    }
}

exports.signup = async (req, res) => {
    const e_user = await userSchema.findOne({ u_email: req.body.u_email })
    if (e_user) {
        res.send({
            "status": "User already exist!",
            "Data": e_user
        });
    } else {
        const user = new userSchema({
            "u_name": req.body.u_name,
            "u_email": req.body.u_email,
            "u_pic": req.body.u_pic,
            "u_phone": req.body.u_phone,
            "u_password": req.body.u_password
        });
        try {
            const con_save = await user.save();
            res.send({
                "status": "Success",
                "Data": con_save
            });
            console.log(con_save);
        } catch (err) {
            console.log(err);
        }
    }
}

exports.login = async (req, res) => {
    console.log("---in login")
    let token = req.cookies.auth;
    if (token) {
        console.log("---in login if")
        User.findByToken(token, (err, user) => {
            if (err) return res(err);
            if (user) return res.status(400).json({
                error: true,
                message: "You are already logged in"
            });
        });
    } else {
        console.log("---in login else", req.body)
        const user = await userSchema.findOne({ 'u_email': req.body.u_email });
        const token = jwt.sign(JSON.stringify(user), "PWASECRET");
        if (user) {
            await userSchema.findByIdAndUpdate(user._id, { "u_token": token }).then((er, re) => {
                console.log("------yyyyyy-----", re)
            })
            console.log("---in login cp", user.u_password, user.u_email)
            await bcrypt.compare(req.body.u_password, user.u_password, (err, isMatch) => {
                if (isMatch) {
                    res.status(200).json({ message: "Logged in successfully!", user: user });
                } else {
                    res.status(401).json({ error: "Invalid Password" });
                }
            });
        } else {
            res.status(401).json({ error: "User does not exist" });
        }
        // userSchema.findOne({ 'u_email': req.body.u_email }, function (err, user) {
        // if (!user) return res.json({ isAuth: false, message: ' Auth failed ,email not found' });
        // console.log("---in login cp")
        // const validPassword = await bcrypt.compare(req.body.u_password, user.u_password);
        // userSchema.comparepassword(req.body.u_password, (err, isMatch) => {
        //     if (!isMatch) return res.json({
        //         isAuth: false, message: "password doesn't match"
        //     });
        // });
        // console.log("---in login cp", validPassword)
        // if (validPassword) {
        //     res.status(200).json({ message: "Valid password" });
        //   } else {
        //     res.status(400).json({ error: "Invalid Password" });
        //   }
        // userSchema.generateToken((err, user) => {
        //     if (err) return res.status(400).send(err);
        //     res.cookie('auth', user.u_token).json({
        //         isAuth: true,
        //         id: user._id
        //         , email: user.u_email
        //     });
        // });

    }
}

const generateToken = (err, user) => {
    var user = this;
    console.log("-----user", user)
    var token = jwt.sign(user._id, "PWASECRET", {
        expiresIn: 604800 // 1 week
    });

    user.u_token = token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    })
}

exports.addToCart = async (req, res) => {
    console.log("cart body----->", req.body)
    Cart.findOne({ 'user_id': req.body.user_id, 'product_id': req.body.product_id })
        .exec((err, ct) => {
            console.log("------cart gettttt", ct)
            if (err) {
                res.status(200).send({
                    "status": "Error",
                    "message": "Something went wrong!"
                });
            }
            if (ct) {
                if (req.body.cart_action) {
                    Cart.findByIdAndUpdate({ _id: ct._id }, { product_qty: ct.product_qty + 1 }, { new: true })
                        .exec((err, upCart) => {
                            if (upCart) {
                                console.log("-----upcart", upCart)
                                res.status(200).send({
                                    "status": "Success",
                                    "message": "Cart updated suceessfully!",
                                    "data": upCart
                                });
                            }
                        })
                } else {
                    Cart.findByIdAndUpdate({ _id: ct._id }, { product_qty: ct.product_qty - 1 }, { new: true })
                        .exec((err, upCart) => {
                            if (upCart) {
                                console.log("-----upcart", upCart)
                                if (upCart.product_qty <= 0) {
                                    Cart.findByIdAndDelete(upCart._id, (er, rt) => {
                                        if (er) {
                                            console.log("deleted---", er)
                                        } else {
                                            console.log("deleted---", rt)
                                            res.status(200).send({
                                                "status": "Success",
                                                "message": "Item is removed!"
                                            });
                                        }
                                    })

                                } else {
                                    res.status(200).send({
                                        "status": "Success",
                                        "message": "Cart updated suceessfully!",
                                        "data": upCart
                                    });
                                }
                            }
                        })
                }
            } else {
                if(!req.body.cart_action){
                    console.log("iiii0", req.body.cart_action)
                    res.status(200).send({
                        "status": "Failed",
                        "message": "Not a good request!",
                    });
                }else{
                    const cart = new Cart({
                        "user_id": req.body.user_id,
                        "product_id": req.body.product_id,
                        "product_qty": 1,
                    });
                    try {
                        const data = cart.save();
                        res.status(200).send({
                            "status": "Success",
                            "message": "Product added to cart successfully!",
                        });
                        console.log("--------cart user_product added");
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        });

}

exports.getCart = (req, res) => {
    console.log("---------get data", req.headers.user_id)
    Cart.find({ user_id: req.headers.user_id })
        .populate('product_id')
        .exec((err, cart) => {
            console.log("---------get data", cart)
            res.status(200).json({
                "status": "Success",
                "Data": cart
            })
        })
}

exports.getAllUsers = (req, res) => {
    userSchema.find({ limit: 10 }, (er, users) => {
        console.log("-----users----", users)
        res.status(200).send({
            "status": "Success",
            "Data": users
        })
    })
}