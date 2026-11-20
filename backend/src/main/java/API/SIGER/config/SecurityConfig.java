package API.SIGER.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> {
                    auth
                            .requestMatchers(HttpMethod.GET, "/eventos").permitAll()
                            
                            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                            
                            .requestMatchers(HttpMethod.POST, "/eventos").hasRole("ORGANIZADOR")
                            .requestMatchers(HttpMethod.PUT, "/eventos/*").hasRole("ORGANIZADOR")
                            .requestMatchers(HttpMethod.PATCH, "/eventos/*/estado").hasRole("ORGANIZADOR")
                            
                            .requestMatchers(HttpMethod.GET, "/ubicaciones", "/ubicaciones/*").permitAll()
                            .requestMatchers(HttpMethod.DELETE, "/ubicaciones/*").hasRole("ADMINISTRADOR")
                            .requestMatchers("/ubicaciones/**").hasAnyRole("ADMINISTRADOR", "ORGANIZADOR")
                            
                            .requestMatchers(HttpMethod.POST, "/auth/registro").permitAll()
                            .requestMatchers(HttpMethod.GET, "/auth/me").authenticated()
                            
                            .requestMatchers(HttpMethod.POST, "/reservaciones").hasRole("PARTICIPANTE")
                            .requestMatchers(HttpMethod.PATCH, "/reservaciones/*/cancelar").hasRole("PARTICIPANTE")
                            .requestMatchers(HttpMethod.GET, "/reservaciones/*/comprobante").hasRole("PARTICIPANTE")

                            .requestMatchers(HttpMethod.PUT, "/auth/me/perfil", "/auth/me/password").authenticated()

                            .requestMatchers(HttpMethod.POST, "/contacto").permitAll()
                            
                            .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                            
                            .requestMatchers("/eventos/*/asistencias/**").hasRole("ORGANIZADOR")
                            .requestMatchers("/reportes/usuarios").hasRole("ADMINISTRADOR")
                            .requestMatchers("/usuarios/**").hasRole("ADMINISTRADOR")
                            .requestMatchers("/reportes/**").hasAnyRole("ADMINISTRADOR", "ORGANIZADOR")
                            
                            .anyRequest().authenticated();
                })
                .csrf(AbstractHttpConfigurer::disable)
                
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) 
                
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .httpBasic(basic -> basic.authenticationEntryPoint((request, response, ex) -> {
                    response.setStatus(401);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"mensaje\":\"Credenciales inválidas o ausentes\"}");
                }))
                .exceptionHandling(ex -> ex.accessDeniedHandler((request, response, e) -> {
                    response.setStatus(403);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"mensaje\":\"No tienes permiso para esta operación\"}");
                }));

        return http.build();
    }

    // BEAN PARA CONFIGURAR CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // Necesario para Basic Auth

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}