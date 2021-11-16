import OmniAural from "omniaural"

// Implement any custom player OmniAural actions here

const togglePlayer = (show:boolean) => {
    OmniAural.state.player.show.set(show)
}

OmniAural.addAction("togglePlayer", togglePlayer)
