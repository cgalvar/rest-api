//@ts-check


class RestFunctions{
    

    static queryBuilder(query, criteria){
        if (!isEmptyObject(criteria)) {
            for (const key in criteria) {
                if (criteria.hasOwnProperty(key)) {
                    
                    const element = parse(criteria[key]);
                    
                    if(basicQuery.includes(key))
                        this.processBasicQuery(query, key, element)
                    
                    else if(notBasicQuery.includes(key))
                        this.processNotBasicQuery(query, key, element);
                    
                    else if (key == 'populate') 
                        this.processPopulate(query, element);
                    
                    else if (key == 'has') {
                        this.processHas(query, element);
                    }

                    else if (key == 'whereHas') {
                        this.processWhereHas(query, element);
                    }

                }
            }
        }
    }

    
    // go to basicQuery to see method supported
    static processBasicQuery(query, method, criteria){

        if(query[method])
            for (const key in criteria) {
                if (criteria.hasOwnProperty(key)) {
                    const element = criteria[key];
                    query[method](key, element);
                }
            }
    }

    static processNotBasicQuery(query, method, criteria){
        for (const key in criteria) {
            if (criteria.hasOwnProperty(key)) {
                const element = criteria[key];
                
                if (method == 'whereContains') {
                    query.where(key,'like',`%${element}%`);
                }
                else if (method == 'whereStartsWith') {
                    query.where(key,'like',`${element}%`);
                }
                else if (method == 'whereEndsWith') {
                    query.where(key,'like',`%${element}`);
                }
                else if (method == 'whereGreaterThan') {
                    query.where(key, '>', element)
                }
                else if (method == 'whereLessThan') {
                    query.where(key, '<', element)
                }

                /** orWhere */

                if (method == 'orWhereContains') {
                    query.orWhere(key,'like',`%${element}%`);
                }
                else if (method == 'orWhereStartsWith') {
                    query.orWhere(key,'like',`${element}%`);
                }
                else if (method == 'orWhereEndsWith') {
                    query.orWhere(key,'like',`%${element}`);
                }
                else if (method == 'orWhereGreaterThan') {
                    query.orWhere(key, '>', element)
                }
                else if (method == 'orWhereLessThan') {
                    query.orWhere(key, '<', element)
                }

                /** Where Not */

                if (method == 'whereNotContains') {
                    query.whereNot(key,'like',`%${element}%`);
                }
                else if (method == 'whereNotStartsWith') {
                    query.whereNot(key,'like',`${element}%`);
                }
                else if (method == 'whereNotEndsWith') {
                    query.whereNot(key,'like',`%${element}`);
                }
                else if (method == 'whereNotGreaterThan') {
                    query.whereNot(key, '>', element)
                }
                else if (method == 'whereNotLessThan') {
                    query.whereNot(key, '<', element)
                }
                
                /** Or Where Not */

                if (method == 'OrWhereNotContains') {
                    query.OrWhereNot(key,'like',`%${element}%`);
                }
                else if (method == 'OrWhereNotStartsWith') {
                    query.OrWhereNot(key,'like',`${element}%`);
                }
                else if (method == 'OrWhereNotEndsWith') {
                    query.OrWhereNot(key,'like',`%${element}`);
                }
                else if (method == 'OrWhereNotGreaterThan') {
                    query.OrWhereNot(key, '>', element)
                }
                else if (method == 'OrWhereNotLessThan') {
                    query.OrWhereNot(key, '<', element)
                }

            }
        }
    }

    static processPopulate(query, criteria){

        for (let i = 0; i < criteria.length; i++) {
            const populateElement = criteria[i];
            
            if(typeof populateElement == 'string'){
                query.with(populateElement);
            }
    
            else{
                query.with(populateElement.resource, builder=>{
                    delete populateElement.resource;
                    this.queryBuilder(builder, populateElement);
                });
            }
        }


    }

    static processHas(query, criteria){

        for (let i = 0; i < criteria.length; i++) {
            const hasCriteriaElement = criteria[i];
            
            if(typeof hasCriteriaElement == 'string'){
                query.has(hasCriteriaElement);
            }
    
            else if(hasCriteriaElement.has || hasCriteriaElement.whereHas){
                this.processWhereHas(query, hasCriteriaElement);
            }

            else{
                if (hasCriteriaElement.lessThan) {
                    query.has(hasCriteriaElement.resource, '<', hasCriteriaElement.lessThan);
                }
                else if (hasCriteriaElement.greaterThan) {
                    query.has(hasCriteriaElement.resource, '>', hasCriteriaElement.greaterThan);
                }
            }
        }

    }
    
    static processWhereHas(query, criteria){
        for (let i = 0; i < criteria.length; i++) {
            const whereHasCriteria = criteria[i];
            
            if (whereHasCriteria.lessThan) {
                query.whereHas(whereHasCriteria.resource, builder=>{
                    delete whereHasCriteria.resource;
                    this.queryBuilder(builder, whereHasCriteria);
                }, '<', whereHasCriteria.lessThan);
            }

            else if (whereHasCriteria.greaterThan) {
                query.whereHas(whereHasCriteria.resource, builder=>{
                    delete whereHasCriteria.resource;
                    this.queryBuilder(builder, whereHasCriteria);
                }, '>', whereHasCriteria.greaterThan);
            }

            else{

                query.whereHas(whereHasCriteria.resource, builder=>{
                    delete whereHasCriteria.resource;
                    this.queryBuilder(builder, whereHasCriteria);
                });
            }



        }
    }




}

class Rest{

    static async index(criteria, query){
        RestFunctions.queryBuilder(query, criteria);

        let result = await query.fetch();

        return result.toJSON();
    }

    // show a single record
    // GET /api/producto/1/buyers
    
    /**
     *
     *  Show associated records 
     * 
     *  GET /api/modelName/:id/associatedModel
     * 
     * @static
     * @param {*} baseRecord
     * @param {string} associationName
     * @param {*} criteria
     * @returns
     * @memberof Rest
     */
    static async indexAsociation(baseRecord, associationName, criteria){
        
        
        let query = baseRecord[associationName]();
        
        
        RestFunctions.queryBuilder(query, criteria);

        let result = await query.fetch();

        return result.toJSON();

    }

    // PUT /api/producto/:id
    static async update(record, data){

        record.merge(data);
        await record.save();

        return record;

    }

    static async updateMany(records, model){

        let promises = [];

        for (const record of records) {
            let recordToUpdate = await model.find(record.id);
            recordToUpdate.merge(record);
            promises.push(recordToUpdate.save());
        }

        return Promise.all(promises);

    }

    
}

module.exports = Rest;

function isEmptyObject(object) {
    return !Object.keys(object).length;
}

function parse(element){
    try {
        return JSON.parse(element);
    } catch (error) {
        return element;
    }
}

const basicQuery = [
    "orWhere",
    "whereNot",
    "where",
    "orWhereNot",
    "whereBetween",
    "orWhereBetween",
    "whereNotBetween"
];

const notBasicQuery = [
    "whereContains",
    "whereGreaterThan",
    "whereLessThan",
    "whereStartsWith",
    "whereEndsWith"
];
