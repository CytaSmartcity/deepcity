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
}