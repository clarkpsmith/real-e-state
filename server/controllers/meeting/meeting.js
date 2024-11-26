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

   const processedResults = addCreatedByName(result);


    try {
        res.send(processedResults);
    } catch (error) {
        res.send(error)
    }
    
}


const view = async (req, res) => {
    try {
        let response = await MeetingHistory.findOne({ _id: req.params.id }).populate({ path: 'createBy', match: { deleted: false } })
        if (!response) return res.status(404).json({ message: "no Data Found." })

            createdByName = response.createBy.firstName + " " + response.createBy.lastName;

            if(createdByName) {
                response.createdByName = createdByName
            }

            res.send(response);
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

const addCreatedByName = (dataArr) => {
  const processedResults = [];

  dataArr.forEach((data) => {
    data.createdByName = data.createBy.firstName + " " + data.createBy.lastName;
    if(data.createdByName) {
        processedResults.push(data);
    }

  });
  return processedResults;
};

module.exports = { add, index, view, deleteData, deleteMany }