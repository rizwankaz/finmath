module Bachelier

using Distributions

const N = Normal(0, 1)

function bachelier(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, is_call::Bool)
    forward = S * exp(r * T)
    σ_sqrt_T = σ * sqrt(T)
    d = (forward - K) / σ_sqrt_T
    
    if is_call
        return exp(-r * T) * ((forward - K) * cdf(N, d) + σ_sqrt_T * pdf(N, d))
    else
        return exp(-r * T) * ((K - forward) * cdf(N, -d) + σ_sqrt_T * pdf(N, d))
    end
end

put(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64) = 
    bachelier(S, K, T, r, σ, false)

call(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64) = 
    bachelier(S, K, T, r, σ, true)

export put, call

end
