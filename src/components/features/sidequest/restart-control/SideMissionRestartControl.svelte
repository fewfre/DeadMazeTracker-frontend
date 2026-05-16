<script lang="ts">
    import { sideMissionApi, type SideMissionRestartTrackerInfo, type SideMissionVoteRestartRequest } from "../../../../api/side-missions";
    import type { AlertType } from "../../../common/AlertBox.svelte";
    import { cancelEarlyIfNotAuthenticated } from "../../../structure/auth/auth0-helpers";
	
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
	}
	const { restartData, setAlert, triggerRefresh } : Props = $props();
	
	const restartVotesUp = $derived(restartData?.votesUp ?? 0);
	const restartVotesDown = $derived(restartData?.votesDown ?? 0);
	const restartResetCount = $derived(restartData?.resetCount ?? 0); // needed so we can properly know when to clear vote history

	const danger = $derived(restartVotesUp > restartVotesDown/2 && restartVotesUp >= 9);
	
	const handleVoteApiCall = async (req:SideMissionVoteRestartRequest) => {
			setAlert(null);
			if(await cancelEarlyIfNotAuthenticated()) return;
			
			const applyVoteToData = (entry:{ votesUp:number; votesDown:number; }, upvote:boolean, add:boolean) => { entry[upvote ? 'votesUp' : 'votesDown'] += add ? 1 : -1; }
			
			// applyVoteToData($data.zones.flatMap(z=>z.missions).find(o => o.id === req.id)!, req.upvote, !req.undo);
			// mutate($data, { revalidate: false });
			// sideMissionsVoteHistory.toggleVote(req.id, req.upvote ? 'up' : 'down');
			const revert = () => {
			// 	sideMissionsVoteHistory.toggleVote(req.id, req.upvote ? 'up' : 'down');
			// 	applyVoteToData($data.zones.flatMap(z=>z.missions).find(o => o.id === req.id)!, req.upvote, !!req.undo);
			// 	mutate($data, { revalidate: false });
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
		<div style='border:1px solid #DDD; padding:0 4px 1px;'>
			<p>Whenever the game updates and server restarts, the locations of NPCs change, and this list needs to be reset early.</p>
			<p>If 15+ people vote positive about a reset and 80% of the votes are positive this list will reset. Note: these votes reset every hour (##:00).</p>
			<p>Please don't vote negative about a reset unless combatting trolls, as otherwise if a reset does happen it'll take longer to fix it.</p>
			
			<div class='vote-buttons-group'>"
				<button class='restart-vote-up vote-up' onclick={()=>handleVoteApiCall({ upvote:true, undo:false })}>Yes there was a restart ✔ <span class='num'>{restartVotesUp}</span></button>
				<button class='restart-vote-down vote-down' onclick={()=>handleVoteApiCall({ upvote:true, undo:false })}>No, don't clear the list! ✘ <span class='num'>{restartVotesDown}</span></button>
			</div>
		</div>
	</details>
{/if}

<style>
.danger {
	background: blueviolet;
}
</style>