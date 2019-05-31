const Purchase = require('../models/Purchase')
const Ad = require('../models/Ad')
const User = require('../models/User')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')

    if (purchaseAd.purchasedBy) {
      return res.status(400).json({ error: 'This ad alrady been purchased' })
    }

    const user = await User.findById(req.userId)

    const purchase = await Purchase.create({
      content,
      ad,
      byer: user._id
    })

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    return res.json(purchase)
  }

  async update (req, res) {
    const { id } = req.params
    const { ad } = await Purchase.findById(id).populate({
      path: 'ad',
      populate: {
        path: 'author'
      }
    })

    if (!ad.author._id.equals(req.userId)) {
      return res.status(401).json({ error: "You're not the ad author" })
    }

    if (ad.purchasedBy) {
      return res.status(400).json({ error: 'This ad alrady been purchased' })
    }

    ad.purchasedBy = id

    await ad.save()

    return res.json(ad)
  }
}

module.exports = new PurchaseController()
