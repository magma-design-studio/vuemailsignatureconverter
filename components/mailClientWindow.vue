<template>
    <div class="mailclientwindow">
        <div class="mailclientwindow__header"><span></span></div>
        <slot name="letter">
            Dear Lazy Dog, <br />
            <br />
            I hope this message finds you well and resting comfortably after your recent athletic endeavor. I must say, I was thoroughly impressed by the spectacle of "The quick brown fox jumps over the lazy dog." Watching a fox leap over you while you lounged so peacefully was nothing short of spectacular.<br />
            <br />
            Best regards,
        </slot>
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
.mailclientwindow {
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-right: 4px solid black;
    border-bottom: 4px solid black;
    border-radius: 1em;
    padding: 1em;
    overflow: hidden;
    font-family: Helvetica, sans-serif;
    margin-bottom: .5em;

    &__header {
        background-color: rgb(241, 241, 241);
        height: 30px;
        margin: -1em -1em 1em -1em;
        position: relative;
        span {
            &,
            &::before,
            &::after {
                width: 15px;
                height: 15px;
                position: absolute;
                border-radius: 50%;
                background-color: black;
                left: 1em;
                top: 50%;
                transform: translateY(-50%);
            }

            &::after,
            &::before {
                content: '';
            }

            &::before {
                left: calc( .5em + 15px );
                opacity: .5;
            }

            &::after {
                left: calc( 1em + 30px );
                opacity: .25;

            }
        }
    }
}
</style>