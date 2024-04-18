const slugify = require("slugify");
const categoryModel = require("../model/CategoryModel");

module.exports.createCategory = async function createCategory(req, res) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Category Already Exisits",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(200).send({
      success: true,
      message: "new category created",
      category,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

module.exports.updateCategory=async function updateCategory(req,res){
    try {
      const { name } = req.body;
      console.log("name to be updated",req.body.name)
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    console.log("item found is ",category)
    res.status(200).send({
      success: true,
      messsage: "Category Updated Successfully",
      category,
    });

    } catch (err) {
        res.send({
            message: err.message,
            success: false,
        })
    }
}
module.exports.deleteCategory=async function deleteCategory(req,res){
  try {
    let id = req.params.id;
    let deleted = await categoryModel.findByIdAndDelete(id);
    return res.send({
        message: 'category deleted successfully',
        success: true,
        data: deleted
    })
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
  })
  }
}
module.exports.getallcategory=async function getallcategory(req,res){
  try {
    let category=await categoryModel.find()
    if(category){
      return res.status(200).json({
        message: "all category  retreived successfully ",
        category:category
      })
      
    }
    else{
      return res.status(201).send({
        message: 'categories not found',
        success: false,
      })
    }
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
  })
  }
}
module.exports.getcategory=async function getcategory(req,res){
  try {
    let find=req.params.slug   // can also use destructure   const {  id  }=req,params
    if(find){
      let category=await categoryModel.findOne({slug:find})
      if(category){
        return res.send({
          message:"category retreived successfully",
          category
        })
        
      }
      else{
        return res.status(401).send({
          message:"no such category found"
        })
      }
    }
    else{
      return res.status(400).send({
        message:"no such id found"
      })
    }
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
  })
  }
}