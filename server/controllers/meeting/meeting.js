const MeetingHistory = require('../../model/schema/meeting')



const add = async (req, res) => {
    try {
        req.body.createdDate = new Date();
        const user = new MeetingHistory(req.body);
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        console.error('Failed to create Meeting:', err);
        res.status(400).json({ error: 'Failed to create Meeting' });
    }
   
}


const index = async (req, res) => {
    const query = req.query
    query.deleted = false;

    let allData = await MeetingHistory.find(query).populate({
        path: 'createBy',
        match: { deleted: false } // Populate only if createBy.deleted is false
    }).exec()

    const result = allData.filter(item => item.createBy !== null);

    result.forEach(data => {
        const fullName = data.createBy.firstName + data.createBy.lastName
    data.creatByName = fullName
})

    try {
        res.send(result)
    } catch (error) {
        res.send(error)
    }
    
}


const view = async (req, res) => {
    try {
        let response = await MeetingHistory.findOne({ _id: req.params.id })
        if (!response) return res.status(404).json({ message: "no Data Found." })
            res.send(response)
        } catch (error) {
            res.send(error)
        }

}

const deleteData = async (req, res) => {
    try {
        const contact = await MeetingHistory.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", contact })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const deleteMany = async (req, res) => {
    try {
        const contact = await MeetingHistory.updateMany({ _id: { $in: req.body } }, { $set: { deleted: true } });
        res.status(200).json({ message: "done", contact })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

module.exports = { add, index, view, deleteData, deleteMany }