'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, GraduationCap, DollarSign, Quote, Tag } from 'lucide-react';
import { Persona } from '@/lib/api/customer-segment';


interface PersonaCardProps {
    persona: Persona;
    onClick?: (persona: Persona) => void;
    className?: string;
}

export function PersonaCard({
    persona,
    onClick,
    className = ""
}: PersonaCardProps) {
    return (
        <Card
            className={`
        cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] 
        border-l-4 border-l-green-500 bg-white
        ${className}
      `}
            onClick={() => onClick?.(persona)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {persona.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                {persona.name}
                            </CardTitle>
                            {persona.age && (
                                <p className="text-sm text-gray-500">
                                    {persona.age} years old
                                </p>
                            )}
                        </div>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                        {persona.segment.name}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
                {/* Quote */}
                {persona.quote && (
                    <div className="bg-gray-50 p-3 rounded-lg border-l-2 border-l-gray-300">
                        <div className="flex items-start gap-2">
                            <Quote className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                            <p className="text-sm italic text-gray-700 line-clamp-2">
                                "{persona.quote}"
                            </p>
                        </div>
                    </div>
                )}

                {/* Demographics */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    {persona.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 truncate">{persona.location}</span>
                        </div>
                    )}

                    {persona.education && (
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 truncate">{persona.education}</span>
                        </div>
                    )}

                    {persona.gender && (
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 truncate">{persona.gender}</span>
                        </div>
                    )}

                    {persona.incomePerMonth && (
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 truncate">{persona.incomePerMonth}</span>
                        </div>
                    )}
                </div>

                {/* Pain Points Preview */}
                {persona.painPoints && persona.painPoints.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Tag className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium text-gray-700">Pain Points</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {persona.painPoints.slice(0, 2).map((point, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-red-50 text-red-700 border-red-200"
                                >
                                    {point.length > 30 ? `${point.substring(0, 30)}...` : point}
                                </Badge>
                            ))}
                            {persona.painPoints.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{persona.painPoints.length - 2} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Channels Preview */}
                {persona.channels && persona.channels.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Tag className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-700">Channels</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {persona.channels.slice(0, 3).map((channel, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                >
                                    {channel}
                                </Badge>
                            ))}
                            {persona.channels.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{persona.channels.length - 3} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}



export default function PersonaCards({ personas }: { personas: Persona[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personas.map((persona) => (
                <PersonaCard
                    key={persona.id}
                    persona={persona}
                    onClick={() => console.log('Clicked persona:', persona)}
                />
            ))}
        </div>
    );
}
