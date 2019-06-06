//@ts-check

var Rest = require('./rest');



class RestController{
    
    // modelname = '';
    // model;

    constructor(){
        
        this.setModelname();
    }

    setModelname(){
        if(!this.modelname){
            this.modelname = this.constructor.name.split('Controller')[0];
        }

        this.model = this.getModel(this.modelname);
    }

    getModel(modelname){
        modelname = modelname.charAt(0).toUpperCase() + modelname.slice(1)
        //@ts-ignore
        return use(`App/Models/${modelname}`);
    }

// Same Model ########################################################

    // List records
    // Ex: /api/producto?where={nombre: 'cuchara'}&
    async index({request}){
        debugger;
        // get http params
        let criteria = request.all();
        let query = this.model.query();

        return Rest.index(criteria, query);
        

    }

    // show a single record
    // GET /api/producto/1
    async show({params}){
        let {id} = params;

        return this.model.find(Number.parseInt(id))

    }

    // Update a single record
    // PUT /api/producto/:id
    async update({params, request}){
        
        let {id} = params;
        let data = request.all();
        let record = this.model.find(Number.parseInt(id));
        
        return Rest.update(record, data);

    }

    
    /**
     * Update many records
     * PUT /api/model/update-many
     */
    async updateMany({params, request}){

        let recordsToUpdate = request.all();

        return Rest.updateMany(recordsToUpdate, this.model);

    }

    // Create a new record
    /**
     * Create a new record
     * 
     * POST /api/modelname
     *
     * @returns
     * @memberof RestController
     */
    async store({request}){
        let data = request.all();
        let record = this.model.create(data);
        return record;
    }

    
    
// Associated Models ##################################################
    
    // List associated records
    // GET /api/producto/1/buyers
    async indexAsociation({request, params}){
        let {id, associationName} = params;
        let criteria = request.all();

        let record = this.model.find(Number.parseInt(id));
         
        
        return Rest.indexAsociation(record, associationName, criteria);
        

    }



}

module.exports = Rest;

