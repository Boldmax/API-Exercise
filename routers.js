const express = require('express');
const router = express.Router();
const petsDb = require('./models/pets');
const ownerDb = require('./models/owner');

router.get('/', (req, res, next) => {
    console.log("router is up")
    return (
        ownerDb.findById(req.params.owner_id)
            .populate("pets")
            .exec()

            .then(owner => {
                return res.render("pets/index", { owner });
            })
            .catch(err => next(err))
    );
});

router.post("/owners/:ownerId/pets", (req, res, next) => {
    const newPet = new petsDb(req.body);
    const { ownerId } = req.params;

    newPet.owner = ownerId;

    return newPet
        .save()
        .then(pet => {
            return Owner.findByIdAndUpdate(
                ownerId,

                { $addToSet: { pets: pet._id } }
            );
        })
        .then(() => {
            return res.redirect(`/owners/${ownerId}/pets`);
        })
        .catch(err => next(err));
})

router.patch('/:ownerId', async (req, res) => {
    const findDb = ownerDb.findById(req.params.ownerId);
    if (findDb == null) {
        return res.status(404).json({ message: 'Cannot find owner' })
    }
    res.ownerDb = findDb;

    if (req.body.name != null) {
        res.ownerDb.name = req.body.name
    }
    try {
        const updateDb = await res.ownerDb.save()
        res.json(updateDb)
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

router.delete('/:ownerId', async (req, res) => {
    const findDb = ownerDb.findById(req.params.ownerId);
    if (findDb == null) {
        return res.status(404).json({ message: 'Cannot find owner' })
    }
    res.ownerDb = findDb;

    try {
        await res.ownerDb.remove()
        res.json({ message: 'Deleted Owner' })
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

module.exports = router