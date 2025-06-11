const config = require('../../config')
const jwt = require('jsonwebtoken')
const Player = require('../player/model')

module.exports = {
  isLoginAdmin: (req, res, next) => {
    try {
      if (!req.session) {
        throw new Error('Session not initialized');
      }
      
      if (!req.session.user) {
        req.flash('alertMessage', `Mohon maaf session anda telah habis silahkan login kembali`)
        req.flash('alertStatus', 'danger')
        return res.redirect('/')
      }
      
      next()
    } catch (err) {
      console.error('Session Error:', err);
      req.flash('alertMessage', `Error: ${err.message}`)
      req.flash('alertStatus', 'danger')
      return res.redirect('/')
    }
  },

  isLoginPlayer : async(req, res, next) =>{ 
    try {
      const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;

      const data = jwt.verify(token, config.jwtKey)

      const player = await Player.findOne({_id : data.player.id})

      if(!player){
        throw new Error()
      }

      req.player =  player
      req.token =  token
      next()
    } catch (err) {
      res.status(401).json({
        error:  'Not authorized to acces this resource'
      })
    }

  }
}