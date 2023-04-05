


function init() {
    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyAebGvZhL7hQLLllFF8Bm7iKyqT7FIyk-I",
        authDomain: "loginauth-38206.firebaseapp.com",
        databaseURL: "https://loginauth-38206-default-rtdb.firebaseio.com/",
        projectId: "loginauth-38206",
        storageBucket: "loginauth-38206.appspot.com",
        messagingSenderId: "479003296642",
        appId: "1:479003296642:web:20b63baf55a2ab0b12459b"
    };
    firebase.initializeApp(firebaseConfig);


    // Get the form and add a submit event listener
    const form = document.getElementById("signin-form");
    form.addEventListener("submit", onSubmit);

    // Get the modal dialog and close button
    const modal = document.getElementById("modal");
    const closeButton = document.getElementsByClassName("close")[0];

    // Add a click event listener to the close button
    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

function onSubmit(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get the vehicle number, vehicle type, and fuel type from the form
    const vehicleNumber = document.getElementById("vehicle-number").value;
    const vehicleType = document.getElementById("vehicle-type").value;
    const fuelType = document.getElementById("fuel-type").value;

    // Validate the vehicle number based on the vehicle type
    // let pattern;
    // if (vehicleType === "car") {
    //     pattern = /^c[ab]{2}\d{4}$/i;
    // } else if (vehicleType === "motorcycle") {
    //     pattern = /^b[ab][a-i]\d{4}$/i;
    // } else {
    //     // Invalid vehicle type
    //     showModal("Invalid vehicle type selected!");
    //     return;
    // }


    let pattern;
if (vehicleType === "car") {
    pattern = /^(caa|cab|cac|cad|cae|caf|cag|cah|cai|caj|cak|cal|cam|can|cao|cap|caq|car|cas|cat|cau|cav|caw|cax|cay|caz|cba|cbb|cbc|cbd|cbe|cbf)\d{4}$/i;
} else if (vehicleType === "motorcycle") {
    pattern = /^(baa|bab|bac|bad|bae|baf|bag|bah|bai|baj|bak|bal|bam|ban|bao|bap|baq|bar|bas|bat|bau|bav|baw|bax|bay|baz|bba|bbb|bbc|bbd|bbe|bbf|bbg|bbh|bbi|bbj|bbk|bbl|bbm|bbn|bbo|bbp|bbq|bbr|bbs|bbt|bbu|bbv|bbw|bbx|bby|bbz|bca|bcb|bcc|bcd|bce|bcf|bcg|bch|bci|bcj|bck|bcl|bcm|bcn|bco|bcp|bcq|bcr|bcs|bct|bcu|bcv|bcw|bcx|bcy|bcz|bda|bdb|bdc|bdd|bde|bdf|bdg|bdh|bdi|bdj|bdk|bdl|bdm|bdn|bdo|bdp|bdq|bdr|bds|bdt|bdu|bdv|bdw|bdx|bdy|bdz|bea|beb|bec|bed|bee|bef|beg|beh|bei|bej|bek|bel|bem|ben|beo|bep|beq|ber|bes|bet|beu|bev|bew|bex|bey|bez|bfa|bfb|bfc|bfd|bfe|bff|bfg|bfh|bfi|bfj|bfk|bfl|bfm|bfn|bfo|bfp|bfq|bfr|bfs|bft|bfu|bfv|bfw|bfx|bfy|bfz|bga|bgb|bgc|bgd|bge|bgf|bgg|bgh|bgi|bgj|bgk|bgl|bgm|bgn|bgo|bgp|bgq|bgr|bgs|bgt|bgu|bgv|bgw|bgx|bgy|bgz|bha|bhb|bhc|bhd|bhe|bhf|bhg|bhh|bhi|bhj|bhk|bhl|bhm|bhn|bho|bhp|bhq|bhr|bhs|bht|bhu|bhv|bhw|bhx|bhy|bhz|bia|bib|bic|bid|bie|bif|big|bih|bii|bij|bik|bil|bim|bin|bio|bip|biq|bir|bis|bit)\d{4}$/i;
} else {
    showModal("Invalid vehicle type selected!");
}

if(!pattern.test(vehicleNumber)) {
    showModal(`Invalid vehicle number for ${vehicleType}!`);
    return;
}


    // Check if the vehicle number already exists in the database
    const vehicleDataRef = firebase.database().ref("vehicleData");
    vehicleDataRef.orderByChild("vehicleNumber").equalTo(vehicleNumber).once("value", snapshot => {
        if (snapshot.exists()) {
            showModal("Vehicle number already registered. Can't register again");
        } else {
            // Generate a new token number
            const tokenNumber = Math.floor(Math.random() * 1000000);

            // Save the vehicle data and token data to the database
            const newVehicleRef = vehicleDataRef.push();
            newVehicleRef.set({
                vehicleNumber: vehicleNumber,
                vehicleType: vehicleType,
                fuelType: fuelType,
                tokenNumber: tokenNumber,
                fuelAllocation: vehicleType === "motorcycle" ? 6 : 20
            }).then(() => {
                showModal(`Vehicle number created successfully. Your token number is ${tokenNumber}. Thank you for registering!`);

                // Copy the token number to the clipboard
                const tempInput = document.createElement("input");
                tempInput.value = tokenNumber;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand("copy");
                document.body.removeChild(tempInput);
            }).catch(error => {
                showModal(`Error: ${error.message}`);
            });
        }
    });
}

function showModal(text) {
    const modalText = document.getElementById("modal-text");
    modalText.textContent = text;
    const myModal = new bootstrap.Modal(document.getElementById('myModal'));
    myModal.show();
}

// Call the init function when the page loads
init();