setPage(); 


function setPage() {
    getAnimalNames(); 
}

// function to show details of animal upon being clicking
function toggleAnimalDescription() {
    let description = document.querySelectorAll('.description');
    let title = document.querySelectorAll('.title');
    let animalIndex;

    title.forEach((element, index) => {
        element.addEventListener('click', () => {
            if (animalIndex >= 0) {
                description[animalIndex].style.display = "none";
                title[animalIndex].classList.remove("active");
                title[animalIndex].parentElement.classList.remove("active");
            }
            animalIndex = index;
            description[index].style.display = "block";
            element.classList.add('active');
            element.parentElement.classList.add('active');
        })
    })
}


function submitVoteBtn() {
    const btn = document.querySelectorAll('button');
    const votesCount = document.querySelectorAll('.description p span');
    btn.forEach((element, btnindex) => {
        element.addEventListener('click', () => {
            votesCount.forEach((element, voteindex) => {
                if (btnindex == voteindex) {
                    let voteId = btn[btnindex].dataset.id;
                    let numVotes = parseInt(element.textContent) + 1;
                    element.textContent = numVotes;
                    addVote(voteId, numVotes);
                }
            })
        })
    })
}


function addVote(id, number) {
    fetch(`http://localhost:3000/characters/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(
            {
                "votes": number
            }
        ),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(res => {
            console.log(res);
        })
        .catch(err => console.log(err.message));
}


async function getAnimalNames() {
    const animalNames = document.querySelector('.animalNames');
    let output = '';

    await fetch('http://localhost:3000/characters')
        .then(res => res.json())
        .then(res => {
            res.forEach(element => { // For each "span" element, check if the index matches the button index. If it does, update the vote count and send the vote to the database
                output += ` <div class="singleAnimal">
                <p class="title">${element.name}</p>
                <div class="description">
                    <img src="${element.image}" alt="">
                    <p>Votes: <span>${element.votes}</span></p>
                    <button data-id=${element.id}>Add Vote</button>
                </div>
                </div>`
            });

            animalNames.innerHTML = output;
        })
        .catch(err => console.log(err.message));
    
    toggleAnimalDescription();
    submitVoteBtn();
}


const resetButton = document.getElementById('resetButton');

resetButton.addEventListener('click', () => {
  const votesCount = document.querySelectorAll('.description p span');
  votesCount.forEach((element) => {
    element.textContent = '0';
  });
});