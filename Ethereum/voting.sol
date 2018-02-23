contract Voting {

    struct ImprovmentInfos {
        bytes32 title;
        uint8 total_yes;
        uint8 total_no;
        uint8 total_votes;
        bytes32 description;
    }

    mapping (bytes32 => ImprovmentInfos) improvmentsStructs;
    
    bytes32[] public improvmentList;
    
    function addImprovments(bytes32 referenceNo, bytes32 title, bytes32 description) {
        improvmentList.push(referenceNo);
        improvmentsStructs[referenceNo].title = title;
        improvmentsStructs[referenceNo].total_yes = 0;
        improvmentsStructs[referenceNo].total_no = 0;
        improvmentsStructs[referenceNo].total_votes = 0;
        improvmentsStructs[referenceNo].description = description;
    }

    function getImprovmentsInformation(bytes32 referenceNo) public constant returns(bytes32 title,uint8 total_yes, uint8 total_no, uint8 total_votes, bytes32 description) {
         for(uint i = 0; i < improvmentList.length; i++) {
            if (improvmentList[i] == referenceNo) {
                return(
                improvmentsStructs[referenceNo].title,
                improvmentsStructs[referenceNo].total_yes,
                improvmentsStructs[referenceNo].total_no,
                improvmentsStructs[referenceNo].total_votes,
                improvmentsStructs[referenceNo].description
                );
            }
        }
    }

    function checkImprovment(bytes32 referenceNo) returns (bool) {
        for(uint i = 0; i < improvmentList.length; i++) {
            if (improvmentList[i] == referenceNo) {
                return true;
            }
        }
        return false;
    }

    function improvmentVotes(bytes32 referenceNo) public constant returns (uint8, uint8, uint8) {
        if (checkImprovment(referenceNo) == false) throw;
        return (
            improvmentsStructs[referenceNo].total_yes,
            improvmentsStructs[referenceNo].total_no,
            improvmentsStructs[referenceNo].total_votes
        );
    }
    
    function voteImprovment(bytes32 referenceNo,bytes4 vote_type) {
        if (checkImprovment(referenceNo) == false) throw;
        if(vote_type == 'Y') {
            improvmentsStructs[referenceNo].total_yes += 1;
        }
        
        if(vote_type == 'N') {
            improvmentsStructs[referenceNo].total_no += 1;
        }
        
        improvmentsStructs[referenceNo].total_votes += 1;
    }
    
}