<script lang="ts">
    import { sideMissionApi, type ListSideMissionsResponse, type SideMissionRestartTrackerInfo, type SideMissionVoteRestartRequest } from "../../../../api/side-missions";
    import type { AlertType } from "../../../common/AlertBox.svelte";
    import { cancelEarlyIfNotAuthenticated } from "../../../structure/auth/auth0-helpers";
    import { serverRestartVoteHistory } from "../utils/side-missions-vote-history";
	const { voteHistoryStore } = serverRestartVoteHistory;
	
	//////////////////////
	// NOTE:
	// Didn't bother porting this logic fully as I'm currently disabling since no one uses it in it's current state
	// Posting some old jquery code below that's not hooked up /ported yet
	//////////////////////
	
	/*
		function _getRestartTrackerTimestamp() {
			var tDate = getDateWithUTCOffset(0);
			return tDate.getDate()+"-"+tDate.getMonth()+"-"+tDate.getFullYear()+":"+tDate.getHours()+"#"+_resetCount;
		}
		
		////////////////////////////////
		* Hooks
		////////////////////////////////
		function hookButtons() {
			_refreshRestartVoteHistory();
			$(CONT+".restart-vote-up, "+CONT+".restart-vote-down").click(checkIfLoggedInCallbackOnEvent(function(){
				var tBtn = $(this), isPress = !tBtn.hasClass("active");
				
				if(isPress) {
					tBtn.find(".num").html( parseInt(tBtn.find(".num").html())+1 );
					tBtn.addClass("active");
				} else {
					tBtn.find(".num").html( parseInt(tBtn.find(".num").html())-1 );
					tBtn.removeClass("active");
				}
				$(tBtn.hasClass("restart-vote-up") ? ".restart-vote-up-num2" : ".restart-vote-down-num2").html( tBtn.find(".num").html() );
				
				_restartVoteHistory = _restartVoteHistory || {};
				_restartVoteHistory[tBtn.hasClass("restart-vote-up") ? "up" : "down"] = isPress;
				_saveRestartVoteHistory();
				
				$.ajax({ type:"POST", url:`${_ajaxBase}/vote_restart.php`,
					data:{
						unvote:!isPress?"1":"0",
						type:(tBtn.hasClass("restart-vote-up") ? "up" : "down"),
					},
				}).done(function(){
					refreshTable();
				});
			}));
		}
	*/
	
	interface Props {
		restartData:SideMissionRestartTrackerInfo|undefined;
		setAlert:(msg:{ type:AlertType, message:string, dismissible?:boolean }|null) => void;
		triggerRefresh() : void;
		mutateWithCb:(newData:(oldData:ListSideMissionsResponse) => ListSideMissionsResponse, options:{ revalidate:boolean }) => void;
	}
	const { restartData, setAlert, triggerRefresh, mutateWithCb } : Props = $props();
	
	const restartVotesUp = $derived(restartData?.votesUp ?? 0);
	const restartVotesDown = $derived(restartData?.votesDown ?? 0);
	const danger = $derived(restartVotesUp > restartVotesDown/2 && restartVotesUp >= 5);
	
	$effect(() => {
		serverRestartVoteHistory.resetIfResetCountNewer(restartData?.resetCount ?? 0);
	});
	
	const handleVoteApiCall = async (req:SideMissionVoteRestartRequest) => {
			setAlert(null);
			if(await cancelEarlyIfNotAuthenticated()) return;
			
			const applyVoteToData = (entry:{ votesUp:number; votesDown:number; }, upvote:boolean, add:boolean) => { entry[upvote ? 'votesUp' : 'votesDown'] += add ? 1 : -1; }
			mutateWithCb(oldData => { applyVoteToData(oldData.restartTracker, req.upvote, !req.undo); return oldData; }, { revalidate: false });
			serverRestartVoteHistory.toggleVote(req.upvote ? 'up' : 'down');
			const revert = () => {
				serverRestartVoteHistory.toggleVote(req.upvote ? 'up' : 'down');
				mutateWithCb(oldData => { applyVoteToData(oldData.restartTracker, req.upvote, !!req.undo); return oldData; }, { revalidate: false });
			};
			
			sideMissionApi.voteForRestart(req)
			.then(function(resp){
				if('error' in resp) {
					setAlert({ type:'warning', message:resp.error, dismissible:true });
					revert();
				}
			})
			.catch(function(err:Error){
				setAlert({ type:'danger', message:err?.message || "There was an error submitting your vote", dismissible:true })
				console.error(err);
				revert();
			})
			.finally(()=>triggerRefresh());
		}
</script>

{#if restartData}
	<details class:danger>
		<summary>Did server restart recently? (✔ <span class='restart-vote-up-num2'>{restartVotesUp}</span>, ✘ <span class='restart-vote-down-num2'>{restartVotesDown}</span>)</summary>
		<div class='details-content'>
			<p>Whenever the game updates and server restarts, the locations of NPCs change, and this list needs to be reset early.</p>
			<p>If 10+ people vote positive about a reset and 80% of the votes are positive this list will reset. Note: these votes reset every hour (##:00).</p>
			<p>Please don't vote negative about a reset unless combatting trolls, as otherwise if a reset does happen it'll take longer to fix it.</p>
			
			<div class='vote-buttons-group'>"
				<button class='restart-vote-up vote-up' class:active={$voteHistoryStore.vote === 'up'} onclick={()=>handleVoteApiCall({ upvote:true, undo:$voteHistoryStore.vote === 'up' })} disabled={$voteHistoryStore.vote === 'down'}>
					Yes there was a restart ✔ <span class='num'>{restartVotesUp}</span>
				</button>
				<button class='restart-vote-down vote-down' class:active={$voteHistoryStore.vote === 'down'} onclick={()=>handleVoteApiCall({ upvote:false, undo:$voteHistoryStore.vote === 'down' })} disabled={$voteHistoryStore.vote === 'up'}>
					No, don't clear the list! ✘ <span class='num'>{restartVotesDown}</span>
				</button>
			</div>
		</div>
	</details>
{/if}

<style>
details {
	margin-top: -2px;
	margin-bottom: 5px;
	border-radius: 5px;
}
summary {
	padding: 0 5px 2px;
	cursor: pointer;
	&:hover {
		color: white;
	}
}
.details-content {
	border: 1px solid #DDD;
	padding: 1px 4px 4px;
}
.danger {
	background: #6a17b8;
}
	
/* Vote buttons */
.vote-buttons-group { margin:1px 0; }
.vote-buttons-group button {
	border:solid 1px currentColor;
	margin:0;
	font-weight:bold;
	
	&:enabled:hover {
		cursor: pointer;
		box-shadow: 0 0 1px 0 currentColor;
		filter: brightness(90%);
	}
	&.active {
		box-shadow: 0 0 1px 2px white;
		filter: brightness(95%);
	}
	&.active:enabled:hover {
		filter: brightness(90%);
		box-shadow: 0 0 1px 1.5px white;
	}
	&:disabled {
		filter: grayscale(80%);
	}
}
.vote-buttons-group .vote-up { color:green; background:#f3fff0; border-radius:3px 0 0 3px; border-right:0; }
</style>