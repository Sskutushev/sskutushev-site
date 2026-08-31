# ADR-019: the System Core is reflective, not transmissive

Status: accepted. Amends the material table in `docs/design/3D_CONCEPT.md`.

The DATA layer was specified as optical glass and built with drei's `MeshTransmissionMaterial`,
which resolves the shell from a screen-space buffer of everything behind it. Rendered on a GPU
rather than on the software renderer that the headless suite uses, the result was not glass. The
emissive core behind the shell smeared across the whole volume, so the object read as a solid violet
lump; at two samples the buffer reconstruction dithered visibly and the shell looked dirty; and the
prism ramp — which the direction restricts to 10–15% of the frame — covered most of the object.

Raising the sample count fixed the dithering and none of the rest, at the cost of a second render
target on the one canvas the performance contract allows.

The shell is now `MeshPhysicalMaterial`: near-transparent, `clearcoat` at 1, iridescence on the
bevels only, and no transmission at any profile. The interior stays open, the core reads as a small
bright object inside an enclosure rather than as a light box, and the shell holds its highlights
because they come from the environment rather than from a blurred copy of the scene.

Two consequences worth recording. There is no longer a material difference between render profiles
for this layer, only an iridescence term, so the object a visitor sees is the same object at every
tier. And the environment now has to do real work: at `metalness: 1` the bezel renders whatever the
environment contains, and on the near-black ground a single overhead source left it with nothing to
reflect and it read as black rubber. A second broad lightformer from below is what makes it titanium.

Transmission earns its cost again if a case visual needs genuine refraction — an object seen
*through* the shell, where the distortion is the information. The hero is not that.
