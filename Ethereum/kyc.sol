contract KYCitizen {
    mapping(address => PersonDetail) personDetails;

    uint256 public personCounts;

    struct PersonDetail {
        bytes32 first_name;
        bytes32 last_name;
        bytes8 id_number;
        bytes16 phone_number;
        bytes32 district;
        bytes4 post_code;
        bytes32 home_address;
        bytes4 status;
    }

     function addPersonDetails(
        bytes32 first_name, 
        bytes32 last_name, 
        bytes8 id_number,
        bytes16 phone_number,
        bytes32 district,
        bytes4 post_code,
        bytes32 home_address
    ) returns(bool) {
        require(personDetails[msg.sender].id_number == '');
        require(district == 'NIC' || district == 'LIM' || district == 'PAP' || district == 'LAR' || district == 'PAR');
        personDetails[msg.sender].first_name = first_name;
        personDetails[msg.sender].last_name = last_name;
        personDetails[msg.sender].id_number = id_number;
        personDetails[msg.sender].phone_number = phone_number;
        personDetails[msg.sender].district = district;
        personDetails[msg.sender].post_code = post_code;
        personDetails[msg.sender].home_address = home_address;
        personDetails[msg.sender].status = 'A';
        personCounts = personCounts + 1;

        return true;     
    }

}

