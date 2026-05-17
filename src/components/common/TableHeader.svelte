<script>
	const { children } = $props();
</script>

<h3 class="corner-border-box" style="--c:#ccc;--w:10px;--b:2px;--r:5px">
	{@render children?.()}
</h3>

<style>
h3 {
	display: flex;
	align-items: center;
	gap: 5px;
	padding: 2px 10px !important;
	margin-bottom: 5px;
	font-size: 1.5em;
	
	box-sizing:border-box;
	background-color: #FFFFFF22;
}

/* Based on: https://stackoverflow.com/a/61913549/1411473 */
.corner-border-box {
  --b: 5px;   /* thickness of the border */
  --c: red;   /* color of the border */
  --w: 20px;  /* width of border */
  --r: 25px;  /* radius */
  
  padding: var(--b); /* space for the border */
  position:relative;
}
.corner-border-box::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: var(--c,red);
  padding: var(--b);
  border-radius: var(--r);
  -webkit-mask:
    linear-gradient(  0deg,#000 calc(2*var(--b)),#0000 0) 50% var(--b)/calc(100% - 2*var(--w)) 100% repeat-y,
    linear-gradient(-90deg,#000 calc(2*var(--b)),#0000 0) var(--b) 50%/100% calc(100% - 2*var(--w)) repeat-x,
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask:
    linear-gradient(  0deg,#000 calc(2*var(--b)),#0000 0) 50% var(--b)/calc(100% - 2*var(--w)) 100% repeat-y,
    linear-gradient(-90deg,#000 calc(2*var(--b)),#0000 0) var(--b) 50%/100% calc(100% - 2*var(--w)) repeat-x,
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: destination-out;
          mask-composite: exclude;
}
</style>