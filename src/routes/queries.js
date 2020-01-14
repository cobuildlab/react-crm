import gql from "graphql-tag";

export const OPPORTUNITIES_LIST_QUERY = gql`
    query opportunitiesList{
        opportunitiesList{
            items{
                id
                createdAt
                name
                address
                phoneNumber
                stage
            }
        }
    }
`;

export const OPPORTUNITY_UPDATE_MUTATION = gql`
    mutation($data:OpportunityUpdateInput!){
        opportunityUpdate(data:$data){
            id
        }
    }
`;
