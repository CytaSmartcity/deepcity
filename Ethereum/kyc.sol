contract KYC {
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

}