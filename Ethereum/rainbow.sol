library SafeMath {
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a / b;
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

contract ERC20 {
    function balanceOf(address _owner) constant returns (uint256 balance);
    function transfer(address _to, uint256 _value) returns (bool success);
    function allowance(address owner, address spender) constant returns (uint256);
    function transferFrom(address from, address to, uint256 value) returns (bool);
    function approve(address spender, uint256 value) returns (bool);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    
    uint256 public totalSupply;
}

contract Ownable {

  address public owner;

  function Ownable() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
}

contract DistrictToken is ERC20, Ownable {
    using SafeMath for uint256;

    string public constant name = "District Token";
    string public constant symbol = "DCT";
    
    uint256 public constant decimals = 18;

    uint256 public constant initSupply = 100000000 * 10**18;


    mapping(address => uint256)  balances;
    
    mapping(address => mapping (address => uint256)) allowances;


    function DistrictToken() {
        owner = msg.sender;
        totalSupply = initSupply;
        balances[owner] = initSupply;
    }
    
    function transfer(address _to, uint256 _value) returns (bool success) {
        require(_to != 0x0);
    
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        Transfer(msg.sender, _to, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) returns (bool) {
    
        if(_value <= 0) return false;

        if(allowances[_from][msg.sender] < _value) return false;

        if(balances[_from] < _value) return false;

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        allowances[_from][msg.sender] = allowances[_from][msg.sender].sub(_value);
        Transfer(_from, _to, _value);

        return true;
    }

    function balanceOf(address _owner) constant returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) returns (bool) {

        require((_value == 0) || (allowances[msg.sender][_spender] == 0));

        allowances[msg.sender][_spender] = _value;

        Approval(msg.sender, _spender, _value);

        return true;
    }

    function allowance(address _owner, address _spender) constant returns (uint remaining){
        return allowances[_owner][_spender];
    }

    function() {
        assert(true == false);
    }
    
}
