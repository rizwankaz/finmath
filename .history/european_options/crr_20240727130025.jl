module CRR

function CoxRossRubinstein(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64, is_call::Bool)
    δt = T / N
    u = exp(σ * sqrt(δt))
    d = 1 / u
    p = (exp(r * δt) - d) / (u - d)
    disc = exp(-r * δt)
    
    u_power = u^N
    d_power = 1.0
    
    ST = Vector{Float64}(undef, N + 1)
    
    for i in 0:N
        ST[i+1] = S * u_power * d_power
        d_power *= d
        u_power /= u
    end
    
    C = if is_call
        max.(ST .- K, 0.0)
    else
        max.(K .- ST, 0.0)
    end
    
    for _ in 1:N
        for i in 1:length(C)-1
            C[i] = (p * C[i] + (1 - p) * C[i+1]) * disc
        end
        pop!(C)
    end
    
    return C[1]
end

@inline put(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64) = 
    CoxRossRubinstein(S, K, T, r, σ, N, false)

@inline call(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64) = 
    CoxRossRubinstein(S, K, T, r, σ, N, true)

export put, call

end