'use strict';

const moment = require('moment')
const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      console.log(user)
      // user.token = crypto.randomBytes(10).toString('hex')
      user.token = Math.floor(Math.random() * 65536)
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(
        ['emails.forgot_password'],
        {
          email,
          token: user.token,
          link: `${request.input('redirect_url')}?token=${user.token}`
        },
        message => {
          message
            .to(user.email)
            .from('thiagolourencosaraiva123@gmail', 'Thiago Lourenço')
            .subject('Recuperação de Senha')
        }
      )
    } catch (err) {
      return response.json(err)
      // return response
      //   .status(500)
      //   .send({ error: { message: 'Algo deu errado, verificar seu email' } })
    }
  }

  async update ({ request, response }) {
    try {
      const { password, token } = request.all()

      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment()
        .subtract('2', 'days')
        .isAfter(user.token_created_at)

      if (tokenExpired) {
        return response
          .status(401)
          .send({ error: { message: 'Algo deu errado ao resetar a senha' } })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo deu errado ao resetar a senha' } })
    }
  }
}

module.exports = ForgotPasswordController
