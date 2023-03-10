import mongoose from 'mongoose';
import { mongoDbConnectionString } from '../common.config'

class MongooseService {
    private mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    };

    constructor() {
        this.connect();
    }

    getMongoose() {
        return mongoose;
    }

    generateObjectId() {
        return mongoose.Types.ObjectId()
    }


    generateFilterConfig(filterParams: Array<string>, allowedKeys = {}) {
        const filterConfig: Array<unknown> = []
        try {
            if (filterParams.length) {
                filterParams.forEach(filter => {
                    if (!filter) return
                    filter = filter.trim() // removing whitespace
                    const [key, value] = filter?.split(':')
                    if (key in allowedKeys) { //only allowed fields are filterable
                        filterConfig.push({ [key]: { $regex: value, $options: 'i' } })
                    }
                })
            }
        }
        catch (err) {
            console.log('Error processing filter config')
        }

        return filterConfig
    }

    connect = () => {
        mongoose
            .connect(mongoDbConnectionString, this.mongooseOptions)
            .then(() => {
                console.log('MongoDB is connected');
            })
            .catch((err) => {
                console.log('MongoDB connection was unsuccessful')
                console.log(err)
            });
    }
}

export default new MongooseService();