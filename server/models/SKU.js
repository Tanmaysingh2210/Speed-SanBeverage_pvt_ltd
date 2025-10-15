const mongoose = require('mongoose');

const containerSchema = new mongoose.Schema({
    serial: { type: Number, required: true },
    name: { type: String, required: true, lowercase: true, trim: true },
});

const packageSchema = new mongoose.Schema({
    serial: { type: Number, required: true },
    name: { type: String, required: true, lowercase: true, trim: true }
});

const flavourSchema = new mongoose.Schema({
    serial: { type: Number, required: true },
    name: { type: String, required: true, lowercase: true, trim: true }
});

const itemSchema = new mongoose.Schema({
    code:{type:String, required:true},
    name:{type:String, required:true},
    container:{type:String, required:true},
    package:{type:String, required:true},
    flavour: {type:String, required:true}
});

const Container = mongoose.model('SKU_Container', containerSchema);
const Package = mongoose.model('SKU_Package', packageSchema);
const Flavour = mongoose.model('SKU_Flavour', flavourSchema);
const Item = mongoose.model('SKU_Item', itemSchema);

module.exports = { Container, Package, Flavour ,Item };