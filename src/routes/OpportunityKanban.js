import React from 'react';
import {useMutation, useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {useHistory} from 'react-router-dom';
import Board from '@lourenci/react-kanban'
import {OPPORTUNITIES_LIST_QUERY, OPPORTUNITY_UPDATE_MUTATION} from "./queries";


const OpportunityKanban = () => {
  const {data, loading, refetch} = useQuery(OPPORTUNITIES_LIST_QUERY, {fetchPolicy: "network-only"});
  const [updateOpportunity] = useMutation(OPPORTUNITY_UPDATE_MUTATION);
  const [success, setSuccess] = React.useState(false);

  const updateOpp = async (id, newStage) => {
    const variables = {
      data: {id, stage: newStage}
    };
    try {
      await updateOpportunity({variables});
    } catch (e) {
      console.log(`ERROR:`, e);
    }
    setSuccess(true);
    refetch();
  };


  const newOpps = [];
  let proposalOpps = [];
  let wonOpps = [];
  let lostOpps = [];
  let content = null;

  if (!loading) {
    console.log(`DEBUG:`, data.opportunitiesList.items);
    const {items} = data.opportunitiesList;
    items.forEach((opp, i) => {
      if (opp.stage === "NEW")
        newOpps.push({id: opp.id, title: opp.name, description: `${opp.address} - ${opp.phoneNume}`});
      if (opp.stage === "PROPOSAL")
        proposalOpps.push({id: opp.id, title: opp.name, description: `${opp.address} - ${opp.phoneNume}`});
      if (opp.stage === "WON")
        wonOpps.push({id: opp.id, title: opp.name, description: `${opp.address} - ${opp.phoneNume}`});
      if (opp.stage === "LOST")
        lostOpps.push({id: opp.id, title: opp.name, description: `${opp.address} - ${opp.phoneNume}`});
    });
  }

  const board = {
    lanes: [
      {
        id: 1,
        title: 'NEW',
        cards: newOpps
      },
      {
        id: 2,
        title: 'PROPOSAL',
        cards: proposalOpps
      }, {id: 3, title: 'WON', cards: wonOpps}
      , {id: 4, title: 'LOST', cards: lostOpps}
    ]
  };
  return (
    <div>
      {success && <p>OPP UPDATED!</p>}
      <Board onCardDragEnd={(source, destination) => {
        // const cardToBeMoved =
        const {fromLaneId, fromPosition} = source;
        const lane = board.lanes.find(board => board.id === fromLaneId);
        const card = lane.cards[fromPosition];
        const cardId = card.id;

        const {toLaneId} = destination;
        const newLane = board.lanes.find(board => board.id === toLaneId);
        const newStage = newLane.title;

        console.log(`DEBUG:card`, card);
        console.log(`DEBUG:card`, newStage);

        //splice
        // push 
        updateOpp(cardId, newStage);
      }}>
        {board}
      </Board>
    </div>
  );
};

export {OpportunityKanban};
