import React from 'react';
import {useMutation, useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {useHistory} from 'react-router-dom';
import Board from '@lourenci/react-kanban'
import {OPPORTUNITIES_LIST_QUERY, OPPORTUNITY_UPDATE_MUTATION} from "./queries";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {
  Card, Media, CardText, CardBody,
  CardTitle, CardSubtitle
} from 'reactstrap';

const OpportunityKanban = () => {
  const {data, loading, refetch} = useQuery(OPPORTUNITIES_LIST_QUERY, {fetchPolicy: "network-only"});
  const [updateOpportunity] = useMutation(OPPORTUNITY_UPDATE_MUTATION);
  const [success, setSuccess] = React.useState(false);
  const [dirtyOpp, setDirtyOpp] = React.useState(null);
  const [modal, setModal] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});

  const toggle = () => setModal(!modal);

  const updateOpp = async (id, newStage) => {
    setDirtyOpp({
      id,
      stage: newStage
    });
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

  const openModal = (card) => {
    toggle();
    setSelectedCard(card);
  };

  const newOpps = [];
  let proposalOpps = [];
  let wonOpps = [];
  let lostOpps = [];
  let content = null;

  if (!loading) {
    let {items} = data.opportunitiesList;
    console.log(`DEBUG:`, items);
    console.log(`DEBUG:`, dirtyOpp);
    if (dirtyOpp)
      items = items.map(item => {
        if (item.id === dirtyOpp.id)
          item.stage = dirtyOpp.stage;
        return item;
      });
    console.log(`DEBUG:`, items);
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
      {success ? <p>OPP UPDATED!</p> : <p>My opportunities</p>}
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
      }} renderCard={(card, cardBag) => {
        return (
          <Card>
            <Media>
              <Media left href="#">
                <img src="https://cdn4.iconfinder.com/data/icons/seo-communication/512/conversion_rate-512.png"
                     width={50} height={50}/>
              </Media>
              <Media body>
                <Media heading>
                  {card.title}
                </Media>
                {card.address}
              </Media>
              <Button onClick={() => openModal(card)}>View</Button>
            </Media>
          </Card>
        )
      }}>
        {board}
      </Board>
      < Modal
        isOpen={modal}
        toggle={toggle}>
        < ModalHeader
          toggle={toggle}> {selectedCard.title}
        </ModalHeader>
        <ModalBody>
          {selectedCard.description}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export {OpportunityKanban};
