// SPDX-License-Identifier: MPL-2.0
pragma solidity 0.6.2;

//import "@openzeppelin/contracts/GSN/GSNRecipient.sol";
//import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";


contract EasterEggMoney is BaseRelayRecipient{
    bytes32 passHash;
    address owner;
    uint public findersCount = 0;

    //set passHash
    //you can get the hash value from https://www.keccak-256.cloxy.net/ for example
    //choose a strong password!
    // test = 9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658
    constructor(bytes32 _passHash) public payable {
        passHash = _passHash;
        owner =  _msgSender;
  /*       constructor(address _forwarder) public { */
  /*           trustedForwarder = _forwarder; */
	/* } */
    }

    //function to add new funds to EasterEggMoney pool for new finders to be rewarded
    function topup() public payable {}
    //function to recieve funds send to adress of contract
    receive() payable external {}

    //function which takes adress and passphrase, sends all available funds to the given adress if passphrase matches
    function find(address payable _address, string memory _passphrase) public returns(uint findersNR, uint balance) {
        if(keccak256(bytes(_passphrase)) == passHash){
        findersCount ++;
        //send available funds to adress
        _address.transfer(address(this).balance);
        }
        return (findersCount, address(this).balance);
    }

    //function which takes only a passphrase, sends all available funds to the sender if passphrase matches
    function find(string memory _passphrase) public returns(uint findersNR, uint balance) {
        if(keccak256(bytes(_passphrase)) == passHash){
        findersCount ++;
        //send available funds to adress
        payable(_msgSender).transfer(address(this).balance);
        }
        return (findersCount, address(this).balance);
    }

    //function to update passphrase after EasterEgg was found
    function updatepw(bytes32 _passHash) payable public {
    require(_msgSender == owner);
    passHash = _passHash;
    }

    function preRelayedCall(
                            GSNTypes.RelayRequest relayRequest,
                            bytes approvalData,
                            uint256 maxPossibleGas
                            )
        external
        returns (
                 bytes memory context,
                 bool rejectOnRecipientRevert
                 );

    function postRelayedCall(
                             bytes context,
                             bool success,
                             bytes32 preRetVal,
                             uint256 gasUseWithoutPost,
                             GSNTypes.GasData calldata gasData
                             ) external;

    /* function getGasLimits() */
    /*     external */
    /*     view */
    /*     returns ( */
    /*              GasLimits memory limits */
    /*              ); */

}
