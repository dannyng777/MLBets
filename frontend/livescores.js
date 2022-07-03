// http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1
let homepage = document.getElementById('homePage')

const livegames = ()=>{
    fetch('http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1')
        .then(response => response.json())
        .then(response => {
            for(i=0;i<=100;i++) {
                let gameStatus = response.dates[0].games[i].status.detailedState
                let gameVenue = response.dates[0].games[i].venue.name
                let awayTeamName = response.dates[0].games[i].teams.away.team.name
                let awayTeamRecord = response.dates[0].games[i].teams.away.leagueRecord
                let awayTeamScore = response.dates[0].games[i].teams.away.score
                let homeTeamName = response.dates[0].games[i].teams.home.team.name
                let homeTeamRecord = response.dates[0].games[i].teams.home.leagueRecord
                let hometeamScore = response.dates[0].games[i].teams.home.score
                let game = awayTeamName+' vs '+homeTeamName
                console.log(gameStatus)
                console.log(homeTeamName,homeTeamRecord,hometeamScore)
                console.log(awayTeamName,awayTeamRecord, awayTeamScore)

                console.log(response.dates[0].games[i])
                document.getElementById('homePage').innerHTML+=`
                <button type="button" class="livegamehome" data-bs-toggle="modal" data-bs-target="#game${i}">
                    <h1>${awayTeamName} vs ${homeTeamName}</h1>
                    <h2>${awayTeamScore} - ${hometeamScore}</h2>
                    <h5>at ${gameVenue}</h5>
                    <h1>${gameStatus}<h1>
                    <br>
                </button>
                <!-- Modal -->
                <div class="modal fade" id="game${i}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div>
                            Bet Odds for ${game}
                            fdsaf
                            fdsa
                            fdsa
                            fdsa
                            fsda
                            fsd
                            afsda
                            fsad
                            f

                            </div>
                        </div>
                    </div>
                </div>
                `;
            }
        })
        .catch(err => console.error(err));
};

livegames();