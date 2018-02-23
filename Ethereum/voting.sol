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
}