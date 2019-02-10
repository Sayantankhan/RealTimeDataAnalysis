const graphql = require('graphql');
const {GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull,GraphQLFloat, GraphQLSchema, GraphQLObjectType, GraphQLInt} = graphql;

const resturant = require('../model/resturant');
const resturant_inspection = require('../model/inspection');
const userSchema = require('../model/users');

const ResturantType = new GraphQLObjectType({
    name: 'Resturants',
    fields: ()=>({
        CAMIS: {type: GraphQLString},
        DBA: {type: GraphQLString},
        BORO: {type: GraphQLString},
        BUILDING: {type: GraphQLString},
        STREET: {type: GraphQLString},
        ZIPCODE: {type: GraphQLString},
        PHONE: {type: GraphQLString},
        CUISINE_DESCRIPTION: {type: GraphQLString},
        INSPECTION: {
            type: GraphQLList(InspectionType),
            resolve(parent,args){
                return resturant_inspection.find({CAMIS: parent.CAMIS});
            }
        }
    })
});

const InspectionType = new GraphQLObjectType({
    name: 'Inspection',
    fields: ()=>({
        CAMIS: {type: GraphQLString},
        ACTION: {type: GraphQLString},
        VIOLATION_CODE: {type: GraphQLString},
        VIOLATION_DESCRIPTION: {type: GraphQLString},
        CRITICAL_FLAG: {type: GraphQLString},
        SCORE: {type: GraphQLString},
        INSPECTION_TYPE: {type: GraphQLString},
        GRADE: {type: GraphQLString},
        GRADE_DATE: {type: GraphQLString},
        INSPECTION_TYPE: {type: GraphQLString},
        RECORD_DATE: {type: GraphQLString},
        RESTURANTS: {
            type: ResturantType,
            resolve(parent,args){
                return resturant.findOne({CAMIS: parent.CAMIS});
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        name: {type: GraphQLString},
        image_url: {type: GraphQLString},
        email: {type: GraphQLString},
        userId: {type: GraphQLString},
        accessToken: {type: GraphQLString},
        expiresIn: {type: GraphQLFloat},
        reauthorize_required_in: {type: GraphQLFloat},
        signedRequest: {type: GraphQLString}
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        ResturantByBorough : {
            type: GraphQLList(ResturantType),
            args: {borough: {type: GraphQLString}},
            resolve(parent,args){
                return resturant.find({BORO: args.borough})
            }
        },
		Resturant : {
            type: ResturantType,
            args: {camis_id: {type: GraphQLString}},
            resolve(parent,args){
               return resturant.findOne({CAMIS: args.camis_id});
            }
        },
		Resturants : {
            type: new GraphQLList(ResturantType),
            resolve(parent,args){
                return resturant.find({});
            }
        },
        Inspection :{
            type: GraphQLList(InspectionType),
            args: {grade: {type: GraphQLString}},
            resolve(parent,args){
                return resturant_inspection.find({GRADE: args.grade})
            }
        }
    }
});

const MutationQuery = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addAUser: {
            type: UserType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                id: {type: new GraphQLNonNull(GraphQLString)},
                accessToken: {type: new GraphQLNonNull(GraphQLString)},
                image_url: {type: new GraphQLNonNull(GraphQLString)},
                signedRequest: {type: new GraphQLNonNull(GraphQLString)},
                expiresIn: {type: new GraphQLNonNull(GraphQLInt)},
                reauthorize_required_in: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent,args){
                // creating a promise 
                let user = new Promise((resolve,reject) => {
                    userSchema.findOne({userId: args.id},(err,data) =>{
                      if(data == null){
                          reject(data);
                      }else if(err != null){
                          console.log(err);
                      }
                      else{
                          resolve(data);
                      }
                    });
                });

                //promise execution
                return user.then(function(usr){
                    console.log("old one")
                    usr.accessToken = args.accessToken;
                    usr.expiresIn = args.expiresIn;
                    usr.reauthorize_required_in = args.reauthorize_required_in;
                    usr.image_url = args.image_url;

                    return usr.save();
                }).catch(function(data){
                    console.log("new one")
                    let new_user = new userSchema({
                        name: args.name,
                        email: args.email,
                        userId: args.id,
                        accessToken: args.accessToken,
                        image_url: args.image_url,
                        signedRequest: args.signedRequest,
                        expiresIn: args.expiresIn,
                        reauthorize_required_in: args.reauthorize_required_in
                    });
                    return new Promise((resolve, reject) => {
                       resolve(new_user.save());
                    });
                });
                
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query : RootQuery,
    mutation: MutationQuery
});