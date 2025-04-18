This section contains:
- [**Tokenization**](https://elanapearl.github.io/blog/2024/the-illustrated-alphafold/#tokenization) describes how molecules are tokenized and clarifyies the difference between atom-level and token-level
- [**Retrieval (Create MSA and Templates)**](https://elanapearl.github.io/blog/2024/the-illustrated-alphafold/#retrieval-create-msa-and-templates) expalains why and how we include additional inputs to the model.

  It creates our MSA (**m**) and structure templates (**t**).
- [**Create Atom-Level Representations**](https://elanapearl.github.io/blog/2024/the-illustrated-alphafold/#create-atom-level-representations) creates our first atom-level representations **q** (single) and **p** (pair) and includes information about generated conformers of the molecules.
- [**Update Atom-Level Representations (Atom Transformer)**](https://elanapearl.github.io/blog/2024/the-illustrated-alphafold/#update-atom-level-representations-atom-transformer) is the main "Input Embedder" block, also called the "Atom Transformer", which gets repreated 3 times and updates the atom-level single representation (**q**).

  The building blocks introduced here ([**Adaptive LayerNorm**](https://elanapearl.github.io/blog/2024/the-illustrated-alphafold/#1-adaptive-layernorm), [**Attention with Pair Bias**](https://elanapearl.github.io/blog/2024/the-illustrated-alphafold/#2-attention-with-pair-bias), [**Conditioned Gating**](https://elanapearl.github.io/blog/2024/the-illustrated-alphafold/#3-conditioned-gating), and [**Conditioned Transition**](https://elanapearl.github.io/blog/2024/the-illustrated-alphafold/#4-conditioned-transition)) are also relevant later in the model.
- [**Aggregate Atom-Level -> Token-Level**](https://elanapearl.github.io/blog/2024/the-illustrated-alphafold/#aggregate-atom-level--token-level) takes our atom-level representations (**q**, **p**) and aggregates all the atoms that at part of multi-atom tokens to create token-level representations **s** (single) and **z** (pair) and includes information from the MSA (**m**) and any user-provided information about known bonds that involve ligands.

## Tokenization

