<script>
    import Modal from "../../common/modal/Modal.svelte";

	let { showModal = $bindable() } = $props();
</script>

<Modal bind:showModal={showModal}>
	<pre>
TYPED TEXT: REPLACEMENT
----------------------
<!-- nyan cat  : dоge
Nyan cat  : Dоge
cat       : dоg
Cat       : Dоg
catto     : dоggo
Catto     : Dоggo
kitty     : dоggy
Kitty     : Dоggy
meow      : wооf
Meow      : Wооf
c.at      : d.оg
c.a.t     : d.о.g
c a t     : d о g
feline    : cаnine
Feline    : Cаnine
kitten    : puррy
Kitten    : Puррy
dog       : cat
Dog       : Cat
dOg       : cAt
DOG       : CAT
d.og      : c.at
d.o.g     : c.a.t
d o g     : c a t
doggo     : catto
Doggo     : Catto
doge      : nyan cat
Doge      : Nyan cat
doggy     : kitty
Doggy     : Kitty
canine    : feline
Canine    : Feline
puppy     : kitten
Puppy     : Kitten
woof      : meow
Woof      : Meow
doghouse  : cat bed
Doghouse  : Cat bed
wts       : giving away
WTS       : GIVING AWAY
wtb       : begging for
WTB       : BEGGING FOR -->
boss      : (boss image) BOSS
zombie    : infected
Zombie    : Infected
zombies   : infected
spam      : (spam image) spam	
	</pre>
</Modal>