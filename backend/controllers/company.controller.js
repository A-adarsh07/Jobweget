import {Company} from "../models/company.model.js";
export const registerCompany = async (req,res) => {
    try {
        const {companyName} = req.body;
        if(!companyName){
            return res.status(400).json({
                message:"Company name is required",
                success:false
            });
        }
        // if someone tries to add the same name or same company
        let company = await Company.findOne({name:companyName});
        if(Company){
            return res.status(400).json({
                message:"You cannot register same company name",
                success:false
            });
        }
        company= await Company.create({
            name:companyName,
            userId:req.id
        });
        // if the new company is added
        return res.status(201).json({
            message:"Company registered successfully",
            company,
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}

export const getCompany = async (req,res) => {
    try {
        const userId= req.id; //loggedin used id 
        const companies= await Company.find({userId});
        if (!companies) {
            return res.status(404).json({
                message:"Companies not found",
                success:false
            })
        }
    } catch (error) {
        console.log(error);
    }
}
// get company by id
export const getCompanyById = async (req,res) => {
    try {
        const companyId = req.params.id;
        const company =await Company.findById(companyId);
        if(!company) {
            return res.status(404).json ({
                message:"Company not found",
                success:false
            })
        }
        return res.status(200).json(
            {
                company,
                success:true
            }
        )
    } catch (error) {
        console.log(error);
    }
}

// update company info 

export const updateCompany = async (req,res) => {
    try {
        const {name,description,website,location} =req.body;
        const file =req.file;
        // cloudinay content will come below

        const updateData = {name, description,website,location};
        const company = await Company.findByIdAndUpdate(req.params.id, updateData,{new:true});
        if(!company){
            return res.status(404).json({
                message:"Company not found",
                success:false
            })
        }
        return res.status(200).json({
            message:"Company information updated",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}