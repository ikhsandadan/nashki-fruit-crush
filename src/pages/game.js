import { useEffect, useState } from "react";
import { ethers } from "ethers";
import watermelon from "../images/a.png";
import pear from "../images/b.png";
import cherry from "../images/c.png";
import grapes from "../images/d.png";
import orange from "../images/e.png";
import banana from "../images/f.png";
import blank from "../images/blank.png";
import lightning from "../images/lightning.png";

const width = 8;
    const candyColors =[
        watermelon,
        pear,
        cherry,
        grapes,
        orange,
        banana
    ];

function Game({myContract, address, passportProviders, setWalletBalance, email, setPoints}) {
    const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
    const [squareDragged, setSquareDragged] = useState(null);
    const [squareReplaced, setSquareReplaced] = useState(null);
    const [isDraggable, setIsDraggable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [scoreDisplay, setScoreDisplay] = useState(0);
    const [timerInterval, setTimerInterval] = useState();
    const [leaderboard, setLeaderboard] = useState([]);

    const startGame = () => {
        if (!isDraggable) {
            setTimerInterval();
            createBoard();
            setScoreDisplay(0);
            setIsDraggable(true);
            setTimeLeft(60);
        } else {
            setTimerInterval();
            createBoard();
            setScoreDisplay(0);
            setIsDraggable(true);
            clearInterval(timerInterval);
            setTimeLeft(60);
        }
    };

    const startTimer = () => {
        const injuryTime = document.getElementById("time");

        setTimerInterval(setInterval(() => {
            if (timeLeft > 0) {
                setTimeLeft(timeLeft - 1);
            } else {
                clearInterval(timerInterval);
            }
        }, 1000));

        if (timeLeft <= 5) {
            injuryTime.classList.add("animate-ping");
        } else {
            injuryTime.classList.remove("animate-ping");
        }

        if (timeLeft === 0) {
            setIsDraggable(false);
            injuryTime.classList.remove("animate-ping");
            if (scoreDisplay !== 0) {
                alert(`Times Up Your Scores is ${scoreDisplay}`);
            }
        }

        return () => clearInterval(timerInterval);
    };

    useEffect(() => {
        startTimer();
        return () => clearInterval(timerInterval);
    }, [timeLeft]);

    const checkForDoubleLightning = () => {
        const draggedSrc = squareDragged.getAttribute("src");
        const decidedColor = squareReplaced.getAttribute("src");
        const targetFruits = [];

        if (draggedSrc === lightning && decidedColor === lightning) {
            for (let i = 0; i < 64; i++) {
                const isBlank = currentColorArrangement[i] === blank;

                if (!isBlank) {
                    targetFruits.push(i);
                    setScoreDisplay((score) => score + 3);
                    currentColorArrangement[i] = blank;
                }
            }
            return true;
        }
    };

    const checkForLightning = () => {
        const draggedSrc = squareDragged.getAttribute("src");
        const decidedColor = squareReplaced.getAttribute("src");
        const replacedId = parseInt(squareReplaced.getAttribute("id"));
        const targetFruits = [replacedId];

        if (draggedSrc === lightning) {
            for (let i = 0; i < 64; i++) {
                const isBlank = currentColorArrangement[i] === blank;

                if (decidedColor === currentColorArrangement[i] && !isBlank) {
                    targetFruits.push(i);
                    setScoreDisplay((score) => score + 2);
                    targetFruits.forEach((square) => currentColorArrangement[square] = blank);
                }
            }
            return true;
        }
    };

    const checkForColumnOfFive = () => {
        for (let i = 0; i <= 31; i++) {
            const columnOfFive = [i, i + width, i + width * 2, i + width * 3, i + width * 4];
            const decidedColor = currentColorArrangement[i];
            const isBlank = currentColorArrangement[i] === blank;

            if (columnOfFive.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 5);
                let splice = columnOfFive.splice(2, 1);
                columnOfFive.forEach(square => currentColorArrangement[square] = blank);
                currentColorArrangement[splice] = lightning;
                return true;
            };
        };
    };

    const checkForRowOfFive = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfFive = [i, i + 1, i + 2, i + 3, i + 4];
            const decidedColor = currentColorArrangement[i];
            const notValid = [4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31, 36, 37, 38, 39, 44, 45, 46, 47, 52, 53, 54, 55, 61, 62, 63, 64];
            const isBlank = currentColorArrangement[i] === blank;

            if (notValid.includes(i)) continue;

            if (rowOfFive.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 5);
                let splice = rowOfFive.splice(2, 1);
                rowOfFive.forEach(square => currentColorArrangement[square] = blank);
                currentColorArrangement[splice] = lightning;
                return true;
            };
        };
    };

    const checkForColumnOfFour = () => {
        for (let i = 0; i <= 39; i++) {
            const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
            const decidedColor = currentColorArrangement[i];
            const isBlank = currentColorArrangement[i] === blank;

            if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 4);
                columnOfFour.forEach(square => currentColorArrangement[square] = blank);
                return true;
            };
        };
    };

    const checkForRowOfFour = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfFour = [i, i + 1, i + 2, i + 3];
            const decidedColor = currentColorArrangement[i];
            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64];
            const isBlank = currentColorArrangement[i] === blank;

            if (notValid.includes(i)) continue;

            if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 4);
                rowOfFour.forEach(square => currentColorArrangement[square] = blank);
                return true;
            };
        };
    };

    const checkForColumnOfThree = () => {
        for (let i = 0; i <= 47; i++) {
            const columnOfThree = [i, i + width, i + width * 2];
            const decidedColor = currentColorArrangement[i];
            const isBlank = currentColorArrangement[i] === blank;

            if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 3);
                columnOfThree.forEach(square => currentColorArrangement[square] = blank);
                return true;
            };
        };
    };

    const checkForRowOfThree = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfThree = [i, i + 1, i + 2];
            const decidedColor = currentColorArrangement[i];
            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
            const isBlank = currentColorArrangement[i] === blank;

            if (notValid.includes(i)) continue;

            if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 3);
                rowOfThree.forEach(square => currentColorArrangement[square] = blank);
                return true;
            };
        };
    };

    const moveIntoSquareBelow = () => {
        for (let i = 0; i <= 55; i++) {
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
            const isFirstRow = firstRow.includes(i);

            if (isFirstRow && currentColorArrangement[i] === blank) {
                let randomNumber = Math.floor(Math.random() * candyColors.length);
                currentColorArrangement[i] = candyColors[randomNumber];
            }

            if ((currentColorArrangement[i + width]) === blank) {
                currentColorArrangement[i + width] = currentColorArrangement[i];
                currentColorArrangement[i] = blank;
            }
        };
    };

    const dragStart = (e) => {
    if (e.target && e.target.getAttribute("id")) {
        setSquareDragged(e.target);
    } else {
        console.error("Invalid drag drop event");
    }
    };
    
    const dragDrop = (e) => {
    if (e.target && e.target.getAttribute("id")) {
        setSquareReplaced(e.target);
    } else {
        console.error("Invalid drag drop event");
    }
    };

    const dragEnd = () => {
        if (squareDragged && squareReplaced) {
            const squareDraggedId = parseInt(squareDragged.getAttribute("id"));
            const squareReplacedId = parseInt(squareReplaced.getAttribute("id"));

            const validMoves = [
                squareDraggedId - 1,
                squareDraggedId - width,
                squareDraggedId + 1,
                squareDraggedId + width ];

            const validMove = validMoves.includes(squareReplacedId);

            if( validMove) {
                currentColorArrangement[squareReplacedId] = squareDragged.getAttribute("src");
                currentColorArrangement[squareDraggedId] = squareReplaced.getAttribute("src");

                const isDoubleLightning = checkForDoubleLightning();
                const isLightning = checkForLightning();
                const isColoumnOfFive = checkForColumnOfFive();
                const isRowOfFive = checkForRowOfFive();
                const isAColumnOfFour = checkForColumnOfFour();
                const isARowOfFour = checkForRowOfFour();
                const isAColumnOfThree = checkForColumnOfThree();
                const isARowOfThree = checkForRowOfThree();

                if (!(squareReplacedId && (isDoubleLightning || isLightning || isRowOfFive || isARowOfFour || isARowOfThree || isColoumnOfFive || isAColumnOfFour || isAColumnOfThree))) {
                    currentColorArrangement[squareReplacedId] = squareReplaced.getAttribute("src");
                    currentColorArrangement[squareDraggedId] = squareDragged.getAttribute("src");
                    setCurrentColorArrangement([...currentColorArrangement]);
                    setSquareDragged(null);
                    setSquareReplaced(null);
                }

            } else {
                currentColorArrangement[squareReplacedId] = squareReplaced.getAttribute("src");
                currentColorArrangement[squareDraggedId] = squareDragged.getAttribute("src");
                setCurrentColorArrangement([...currentColorArrangement]);
            }
        } else {
            console.error("Invalid drag end event");
        }
    };

    const createBoard = () => {
        const randomColorArrangement = [];
        for (let i = 0; i < width * width; i++) {
            const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
            randomColorArrangement.push(randomColor);
        }
        setCurrentColorArrangement(randomColorArrangement);
    };

    const addPoints = async () => {
        try {
            setIsLoading(true);

            await myContract.addTopScore(address, email, ethers.utils.parseEther(scoreDisplay.toString()), {gasLimit: 2_000_000});

            const newPoints = await myContract.showPoints(address);
            checkLeaderboard();
            setPoints(parseInt(newPoints / 1000000000000000000));

            setScoreDisplay(0);
            setIsLoading(false);
            alert(`Successfuly adding ${scoreDisplay} points to your account!`);
        } catch (e) {
            console.log(e);
        }
    };

    const buyLightning = async () => {
        clearInterval(timerInterval);
        setIsDraggable(false);
        setIsLoading(true);

        const amount = 0.001;
        const amountToHex = ethers.utils.parseEther(amount.toString());
        let randomNumber =  Math.floor(Math.random() * 64);
        
        try {
            await passportProviders.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        to: '0xe9eE885c5F70EDBd39fe7bD488E6503c32e33626',
                        value: amountToHex
                    }, {gasLimit: 2_000_000}
                ]
            });

            currentColorArrangement[randomNumber] = lightning;
            setCurrentColorArrangement(currentColorArrangement);

            checkBalance();

            alert("Successfully Purchased Power Up!!");
        } catch (e) {
            console.log(e);
            alert("Failed Purchased Power Up!!");
        }

        setIsDraggable(true);
        setIsLoading(false);
        startTimer();
    };

    const checkBalance = async () => {
        const balance =  parseInt(await passportProviders.request({
            method: 'eth_getBalance',
            params: [address, 'latest']
        }));

        const balanceToString = ethers.utils.formatEther(balance.toString());
        setWalletBalance(Number(balanceToString).toPrecision(4));
    };

    const checkLeaderboard = async () => {
        const newLeaderboard = await myContract.showTopScore();
        setLeaderboard(newLeaderboard);
    };

    useEffect(() => {
        createBoard();
        checkLeaderboard();
        checkBalance();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            checkForColumnOfFive();
            checkForRowOfFive();
            checkForColumnOfFour();
            checkForRowOfFour();
            checkForColumnOfThree();
            checkForRowOfThree();
            moveIntoSquareBelow();
            setCurrentColorArrangement([...currentColorArrangement]);
        }, 100);
        return () => clearInterval(timer);
    }, [
        checkForColumnOfFive,
        checkForRowOfFive,
        checkForColumnOfFour, 
        checkForRowOfFour, 
        checkForColumnOfThree, 
        checkForRowOfThree,
        moveIntoSquareBelow,
        currentColorArrangement
    ]);

    return (
        <div class="flex flex-row justify-items-center place-content-center gap-0 md:gap-2 lg:gap-20 xl:gap-32 px-5 py-5 auto-rows-auto">
            <div className="flex flex-col w-auto h-auto rounded-xl backdrop-blur-sm bg-white/40 p-2">
                <p className="font-sans font-bold text-yellow-700 text-center text-3xl m-14">LEADERBOARD:</p>
                <div className="flex flex-row place-content-center justify-between">
                    <div className="font-sans font-bold text-yellow-800 text-start text-xl mb-5">Email</div>
                    <div className="font-sans font-bold text-yellow-800 text-center text-xl mb-5">Points</div>
                </div>
                    {leaderboard.map((index, id) => (
                        <div key={id} className="flex flex-row place-content-center justify-between">
                            <div className="font-sans text-yellow-800 text-start text-lg mb-2">
                                {parseInt(index.points) / 1000000000000000000 === 0
                                    ? ""
                                    : `${index.email}`}
                            </div>
                            <div className="font-sans text-yellow-800 text-center text-lg mb-2">
                                {parseInt(index.points) / 1000000000000000000 === 0
                                    ? ""
                                    : `${parseInt(index.points) / 1000000000000000000}`}
                            </div>
                        </div>
                    ))}
            </div>
            <div className="game shrink-0 rounded-xl backdrop-blur-sm bg-white/40">
                {currentColorArrangement.map((candyColor, index) => (
                    <img
                        key={index}
                        src={candyColor}
                        alt={candyColor}
                        id={index}
                        draggable={isDraggable}
                        onDragStart={dragStart}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.preventDefault()}
                        onDragLeave={(e) => e.preventDefault()}
                        onDrop={dragDrop}
                        onDragEnd={dragEnd}
                    />
                ))}
            </div>
            <div className="flex flex-col w-auto h-auto rounded-xl backdrop-blur-sm bg-white/40 p-2">
                <p className="font-sans text-center text-2xl font-black">SCORE:</p>
                <p className="font-sans text-center text-6xl font-black ml-14 mr-14 mb-14">{scoreDisplay}</p>
                <p className="font-sans text-center text-xl font-black ml-14 mr-14">Time Left:</p>
                <p className="font-sans text-center text-4xl font-black ml-14 mr-14 mb-14" id="time">{timeLeft}</p>
                <button onClick={startGame} disabled={isLoading} id="buttonGame" className="primary-btn text-center ml-14 mr-14 w-32 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 duration-300">{isDraggable
                    ? "Reset"
                    : "Start Game"}</button>
                <button onClick={buyLightning} disabled={isLoading} className="primary-btn text-center ml-14 mr-14 my-6 w-32 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 duration-300">Buy Lightning</button>
                <button onClick={addPoints} disabled={isLoading} className="primary-btn text-center ml-14 mr-14 my-10 w-32 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 duration-300">Add to My Points</button>
            </div>
        </div>
    );
}

export default Game;